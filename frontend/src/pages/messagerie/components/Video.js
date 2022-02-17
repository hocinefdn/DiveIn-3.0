import React, { useEffect, useRef, useState } from 'react'
import Peer from 'peerjs'
import io from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux'
import { api } from '../../../constants/constants'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'antd'
import '../css/video.css'
import {
    AudioMutedOutlined,
    AudioOutlined,
    AudioTwoTone,
    PhoneOutlined,
    CameraOutlined,
    VideoCameraOutlined,
    VideoCameraTwoTone,
    LaptopOutlined,
} from '@ant-design/icons'

function Video({ socket, lastMessage }) {
    const myVideo = useRef()
    const otherVideo = useRef()
    const params = useParams()
    const navigate = useNavigate()

    const [stream, setStream] = useState()
    const [peer, setPeer] = useState()

    const [isVideo, setIsVideo] = useState(params.isVideo)
    const [isAudio, setIsAudio] = useState(true)
    const [isScreen, setIsScreen] = useState(false)

    useEffect(() => {
        //const myVideo = document.getElementById("myVideo")
        //const otherVideo =  document.getElementById("otherVideo")
        // get video/voice stream
        var peer = new Peer(params.myId)
        setPeer(peer)
        var bool = true
        myVideo.muted = true
        peer.on('open', (id) => {
            var correspendant = null
            if (isVideo || isAudio)
                if (!isScreen) {
                    navigator.mediaDevices
                        .getUserMedia({
                            video: isVideo,
                            audio: isAudio,
                        })
                        .then(gotMedia)
                        .catch(() => {})
                } else {
                    navigator.mediaDevices
                        .getDisplayMedia({
                            video: isVideo,
                            audio: false,
                        })
                        .then((displayStream) =>
                            navigator.mediaDevices
                                .getUserMedia({
                                    video: false,
                                    audio: isAudio,
                                })
                                .then((audioStream) => {
                                    var outputTracks = []
                                    if (isAudio) {
                                        outputTracks = outputTracks.concat(
                                            audioStream.getTracks()
                                        )
                                    }
                                    outputTracks = outputTracks.concat(
                                        displayStream.getTracks()
                                    )
                                    gotMedia(new MediaStream(outputTracks))
                                })
                        )
                        .catch(() => {})
                }
            function gotMedia(stream) {
                setStream(stream)
                addVideoStream(myVideo, stream)

                var call = peer.call(params.otherId, stream)

                peer.on('call', (call) => {
                    console.log('1st')
                    call.answer()
                    call.on('stream', (otherStream) => {
                        addVideoStream(otherVideo, otherStream)
                    })
                    if (bool) {
                        call = peer.call(params.otherId, stream)
                        bool = false
                    }
                })
            }
            peer.on('call', (call) => {
                console.log('1st')
                call.answer()
                call.on('stream', (otherStream) => {
                    addVideoStream(otherVideo, otherStream)
                })
            })

            socket.emit('join-room-video', params.myId, params.otherId)
        })

        return () => {
            peer.destroy()
            console.log('disconected')
            /* const tracks = myVideo.current.srcObject.getTracks();
            tracks.forEach(function(track) {
                track.stop();
              });*/
        }
    }, [isVideo, isAudio, isScreen])
    useEffect(() => {
        if (lastMessage) {
            if (lastMessage.callStopped) {
                navigate('/messagerie')
            }
            if (lastMessage.userConnectedToCall) {
                if (peer) peer.call(lastMessage.userId, stream)
            }
        }
    }, [lastMessage])
    const addVideoStream = (video, stream) => {
        video.current.srcObject = stream
        video.current.addEventListener('loadedmetadata', () => {
            video.current.play()
        })
    }

    const close = () => {
        socket.emit('call stopped', params.otherId)
        navigate('/messagerie')
    }

    return (
        <div id="firstdiv">
            <video id="myVideo" ref={myVideo}></video>
            <video id="otherVideo" ref={otherVideo}></video>
            <div id="seconddiv">
                {!isScreen ? (
                    <button
                        className="button"
                        onClick={() => setIsVideo(!isVideo)}
                    >
                        {isVideo ? (
                            <VideoCameraTwoTone style={{ fontSize: '30px' }} />
                        ) : (
                            <VideoCameraOutlined style={{ fontSize: '30px' }} />
                        )}
                    </button>
                ) : null}
                <button className="button" onClick={() => setIsAudio(!isAudio)}>
                    {isAudio ? (
                        <AudioTwoTone style={{ fontSize: '30px' }} />
                    ) : (
                        <AudioOutlined style={{ fontSize: '30px' }} />
                    )}
                </button>
                {isVideo ? (
                    <button
                        className="button"
                        onClick={() => setIsScreen(!isScreen)}
                    >
                        {!isScreen ? (
                            <LaptopOutlined style={{ fontSize: '30px' }} />
                        ) : (
                            <CameraOutlined style={{ fontSize: '30px' }} />
                        )}
                    </button>
                ) : null}
                <button className="button">
                    <PhoneOutlined
                        onClick={close}
                        style={{ fontSize: '50px' }}
                    />
                </button>
            </div>
        </div>
    )
}
export default Video
