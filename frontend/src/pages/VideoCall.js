import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    IconButton,
    Typography,
    Paper,
    Tooltip,
    CircularProgress,
    Avatar,
    Fab,
    Grid,
    Button,
    Chip
} from '@mui/material';
import {
    Mic,
    MicOff,
    VideoCall as VideoOn,
    VideocamOff,
    CallEnd,
    Chat,
    Settings,
    Refresh
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';

const VideoCall = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();

    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const [error, setError] = useState(null);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const pcRef = useRef(null);
    const wsRef = useRef(null);

    const configuration = useMemo(() => ({
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
        ],
    }), []);

    // Memoize sendMessage so it can be used in dependencies
    const sendMessage = useCallback((message) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        }
    }, []);

    const createOffer = useCallback(async () => {
        if (!pcRef.current) return;
        try {
            console.log('Creating WebRTC offer...');
            const offer = await pcRef.current.createOffer();
            await pcRef.current.setLocalDescription(offer);
            sendMessage({ type: 'offer', data: offer });
        } catch (err) {
            console.error('Error creating offer:', err);
        }
    }, [sendMessage]);

    const setupPeerConnection = useCallback((stream) => {
        console.log('Setting up PeerConnection...');
        pcRef.current = new RTCPeerConnection(configuration);

        console.log('Adding local tracks to PeerConnection...');
        stream.getTracks().forEach(track => {
            pcRef.current.addTrack(track, stream);
        });

        pcRef.current.ontrack = (event) => {
            console.log('🔥 Received remote track of kind:', event.track.kind);
            if (event.streams && event.streams[0]) {
                console.log('Setting remote stream from event.streams[0]');
                setRemoteStream(event.streams[0]);
            } else {
                console.log('No streams in event, creating a new MediaStream');
                const inboundStream = new MediaStream([event.track]);
                setRemoteStream(inboundStream);
            }
        };

        pcRef.current.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', pcRef.current.iceConnectionState);
        };

        pcRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                sendMessage({ type: 'ice-candidate', data: event.candidate });
            }
        };

        if (user.role === 'hr') {
            console.log('User is HR, will create offer shortly if peer joined message arrives.');
            // Let the peer-joined logic handle creating the offer to ensure both sides are ready
            // But we can also initiate right away just in case the candidate is already there
            createOffer();
        }
    }, [configuration, createOffer, sendMessage, user.role]);

    const setupWebSocket = useCallback((stream) => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // Use user.id or user.uid or user._id as a fallback
        const uid = user.id || user.uid || user._id || 'anonymous';
        const wsUrl = `${protocol}//${window.location.hostname}:8000/ws/video/${roomId}/${uid}`;

        console.log(`Connecting to signaling server: ${wsUrl}`);
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
            console.log('WebSocket connected successfully');
            setIsConnecting(false);
            setupPeerConnection(stream);
        };

        wsRef.current.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            console.log('📩 Received signaling message:', message.type, 'from:', message.userId || 'other');

            try {
                if (message.type === 'offer') {
                    console.log('Handling offer...');
                    if (!pcRef.current) {
                        console.error('PeerConnection not initialized when offer received!');
                        return;
                    }
                    await pcRef.current.setRemoteDescription(new RTCSessionDescription(message.data));
                    const answer = await pcRef.current.createAnswer();
                    await pcRef.current.setLocalDescription(answer);
                    sendMessage({ type: 'answer', data: answer });
                } else if (message.type === 'answer') {
                    console.log('Handling answer...');
                    if (!pcRef.current) return;
                    await pcRef.current.setRemoteDescription(new RTCSessionDescription(message.data));
                } else if (message.type === 'ice-candidate') {
                    if (message.data) {
                        console.log('Adding ICE candidate');
                        if (!pcRef.current) return;
                        await pcRef.current.addIceCandidate(new RTCIceCandidate(message.data));
                    }
                } else if (message.type === 'peer-joined') {
                    console.log('👋 Peer joined, re-initiating offer as HR');
                    if (user.role === 'hr') {
                        setTimeout(() => {
                            if (pcRef.current) createOffer();
                        }, 500); // reduced delay
                    }
                } else if (message.type === 'peer-left') {
                    console.log('🚪 Peer left room');
                    setRemoteStream(null);
                }
            } catch (err) {
                console.error('Error handling signaling message:', err);
            }
        };

        wsRef.current.onclose = (event) => {
            console.log('WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
            // Attempt to reconnect if not closed by user
            if (!event.wasClean && roomId) {
                console.log('Attempting to reconnect WebSocket in 3s...');
                setTimeout(() => setupWebSocket(stream), 3000);
            }
        };

        wsRef.current.onerror = (err) => {
            console.error('WebSocket error:', err);
            setError('Signaling server connection error.');
        };
    }, [createOffer, roomId, sendMessage, setupPeerConnection, user.id, user.uid, user._id, user.role]);

    useEffect(() => {
        if (!user || !roomId) return;

        let activeStream = null;

        const init = async () => {
            try {
                console.log('Initializing media devices...');
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                activeStream = stream;
                setLocalStream(stream);
                setupWebSocket(stream);
            } catch (err) {
                console.error('Error accessing media devices:', err);
                setError('Could not access camera or microphone.');
                setIsConnecting(false);
            }
        };

        if (isAuthenticated) {
            init();
        }

        return () => {
            console.log('Cleaning up media resources...');
            if (activeStream) {
                activeStream.getTracks().forEach(track => track.stop());
            }
            if (pcRef.current) {
                pcRef.current.close();
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [roomId, user, isAuthenticated, setupWebSocket]);

    // Ref callback for remote video to reliably attach stream when DOM node mounts
    const setRemoteVideoRef = useCallback((node) => {
        remoteVideoRef.current = node;
        console.log('Remote video DOM node attached', node ? 'YES' : 'NO');
        if (node && remoteStream) {
            console.log('Setting srcObject on remote video node directly via callback');
            try {
                // If it's the same stream, re-assigning might not hurt, but let's be safe
                if (node.srcObject !== remoteStream) {
                    node.srcObject = remoteStream;
                }
                const playPromise = node.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => console.error('Play failed on attach:', e));
                }
            } catch (err) {
                console.error('Error setting remote srcObject in callback:', err);
            }
        }
    }, [remoteStream]);

    // Ref callback for local video
    const setLocalVideoRef = useCallback((node) => {
        localVideoRef.current = node;
        console.log('Local video DOM node attached', node ? 'YES' : 'NO');
        if (node && localStream) {
            console.log('Setting srcObject on local video node directly via callback');
            try {
                if (node.srcObject !== localStream) {
                    node.srcObject = localStream;
                }
                const playPromise = node.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => console.error('Play failed on local attach:', e));
                }
            } catch (err) {
                console.error('Error setting local srcObject in callback:', err);
            }
        }
    }, [localStream]);

    // Attach local stream when ready or when ref becomes available (fallback)
    useEffect(() => {
        if (localVideoRef.current && localStream && localVideoRef.current.srcObject !== localStream) {
            console.log('Attaching local stream to ref via Effect fallback');
            localVideoRef.current.srcObject = localStream;
            localVideoRef.current.play().catch(e => console.error(e));
        }
    }, [localStream]);

    // Attach remote stream when ready or when ref becomes available (fallback)
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream && remoteVideoRef.current.srcObject !== remoteStream) {
            console.log('Attaching remote stream to ref via Effect fallback');
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play().catch(e => console.error(e));
        }
    }, [remoteStream]);



    const toggleMute = useCallback(() => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    }, [localStream, isMuted]);

    const toggleVideo = useCallback(() => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    }, [localStream, isVideoOff]);

    const endCall = useCallback(() => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (pcRef.current) pcRef.current.close();
        if (wsRef.current) wsRef.current.close();

        // Use explicit navigation back to the dashboard, skip history
        if (user?.role === 'hr') {
            navigate('/hr/dashboard', { replace: true });
        } else {
            navigate('/candidate/dashboard', { replace: true });
        }
    }, [localStream, navigate, user?.role]);

    if (!user || !roomId) {
        return (
            <Box sx={{ height: '100vh', width: '100vw', bgcolor: '#121212', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                <CircularProgress color="inherit" sx={{ mb: 2 }} />
                <Typography sx={{ ml: 2 }}>Loading user and room details...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            height: '100vh',
            width: '100vw',
            bgcolor: '#121212',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
            overflow: 'hidden' // Prevent full page scroll
        }}>
            {/* Header */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', flexShrink: 0 }}>
                <Typography variant="h6" fontWeight={600}>
                    Speak2HR Interview Call
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip label={`Room: ${roomId}`} variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Logged in as {user.name} ({user.role})
                    </Typography>
                </Box>
            </Box>

            {/* Video Grid */}
            <Box sx={{
                flexGrow: 1,
                position: 'relative',
                p: { xs: 1, md: 2 },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden' // Keep videos within bounds
            }}>
                {isConnecting && (
                    <Box sx={{ textAlign: 'center', color: 'white' }}>
                        <CircularProgress color="inherit" sx={{ mb: 2 }} />
                        <Typography>Connecting to call server...</Typography>
                    </Box>
                )}

                {error && (
                    <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
                        <Typography color="error" gutterBottom>{error}</Typography>
                        <Button variant="contained" onClick={() => navigate(-1)}>Go Back</Button>
                    </Paper>
                )}

                {!isConnecting && !error && (
                    <Grid container spacing={{ xs: 1, md: 2 }} sx={{ height: '100%', maxWidth: 1400, m: 0 }}>
                        {/* Remote Video (Main) */}
                        <Grid item xs={12} md={remoteStream ? 9 : 12} lg={remoteStream ? 9 : 12} sx={{ height: '100%', position: 'relative', p: { xs: '0 !important', md: '8px !important' } }}>
                            <Paper sx={{
                                height: '100%',
                                width: '100%',
                                bgcolor: '#202124',
                                borderRadius: { xs: 2, md: 4 },
                                overflow: 'hidden',
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                {remoteStream ? (
                                    <video
                                        ref={setRemoteVideoRef}
                                        autoPlay
                                        playsInline

                                        style={{ height: '100%', width: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                                    />
                                ) : (
                                    <Box sx={{ textAlign: 'center', color: 'white' }}>
                                        <Avatar sx={{ width: 120, height: 120, mb: 2, mx: 'auto', bgcolor: 'primary.main', fontSize: '3rem' }}>
                                            {user.role === 'hr' ? 'C' : 'H'}
                                        </Avatar>
                                        <Typography variant="h5">Waiting for {user.role === 'hr' ? 'candidate' : 'interviewer'} to join...</Typography>
                                    </Box>
                                )}

                                {/* Peer Name Overlay */}
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: 16,
                                    left: 16,
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 1
                                }}>
                                    <Typography variant="body2">
                                        {user.role === 'hr' ? 'Candidate' : 'Interviewer'}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Local Video - Fixed Overlay on mobile, sidebar on desktop */}
                        <Grid item xs={12} md={3} lg={3} sx={{
                            height: { xs: '150px', md: '100%' },
                            position: { xs: 'absolute', md: 'relative' },
                            top: { xs: 80, md: 'auto' },
                            right: { xs: 16, md: 'auto' },
                            width: { xs: '120px', md: '100%' },
                            zIndex: 10
                        }}>
                            <Paper sx={{
                                height: { xs: '100%', md: '30%', lg: '25%' },
                                width: '100%',
                                bgcolor: '#000',
                                borderRadius: 4,
                                overflow: 'hidden',
                                border: '2px solid rgba(255,255,255,0.1)',
                                position: 'relative'
                            }}>
                                {localStream ? (
                                    <video
                                        ref={setLocalVideoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        style={{ height: '100%', width: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                                    />
                                ) : (
                                    <Box sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'gray' }}>
                                        <VideocamOff fontSize="large" />
                                    </Box>
                                )}
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: 8,
                                    left: 8,
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    px: 1,
                                    py: 0.2,
                                    borderRadius: 1
                                }}>
                                    <Typography variant="caption">You ({user.name})</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Box>

            {/* Controls Bar */}
            <Box sx={{
                p: { xs: 2, md: 3 },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: 1.5, md: 3 },
                bgcolor: '#121212',
                flexShrink: 0
            }}>
                <Tooltip title={isMuted ? "Unmute" : "Mute"}>
                    <Fab
                        color={isMuted ? "error" : "default"}
                        onClick={toggleMute}
                        size="medium"
                    >
                        {isMuted ? <MicOff /> : <Mic />}
                    </Fab>
                </Tooltip>

                <Tooltip title={isVideoOff ? "Turn Video On" : "Turn Video Off"}>
                    <Fab
                        color={isVideoOff ? "error" : "default"}
                        onClick={toggleVideo}
                        size="medium"
                    >
                        {isVideoOff ? <VideocamOff /> : <VideoOn />}
                    </Fab>
                </Tooltip>

                <Tooltip title="End Call">
                    <Fab color="error" onClick={endCall} sx={{ width: 64, height: 64 }}>
                        <CallEnd />
                    </Fab>
                </Tooltip>

                <Tooltip title="Refresh Media">
                    <Fab color="default" size="medium" onClick={() => window.location.reload()}>
                        <Refresh />
                    </Fab>
                </Tooltip>

                <Tooltip title="Settings">
                    <Fab color="default" size="medium">
                        <Settings />
                    </Fab>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default VideoCall;
