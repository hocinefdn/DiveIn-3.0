import React, { useEffect, useRef, useState } from 'react'
import Peer from 'peerjs'
import io from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux'
import { api } from '../../../constants/constants'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import '../css/videoGroup.css'
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
import { useParams } from 'react-router-dom'

const axios = require('axios')
function Video({ socket, lastMessage }) {
    const params = useParams()

    const videoGrid = useRef()

    const [stream, setStream] = useState()
    const [peer, setPeer] = useState()
    const [peers, setPeers] = useState([])

    const navigate = useNavigate()
    //const group = urlParams.get('group')

    useEffect(() => {
        var myPeer = new Peer(params.myId)
        setPeer(myPeer)

        const myVideo = document.createElement('video')
        myVideo.muted = true

        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: true,
            })
            .then((stream) => {
                setStream(stream)
                addVideoStream(myVideo, stream)

                myPeer.on('call', (call) => {
                    call.answer(stream)
                    const video = document.createElement('video')
                    call.on('stream', (userVideoStream) => {
                        addVideoStream(video, userVideoStream)
                    })
                })
            })

        myPeer.on('open', (id) => {
            socket.emit('join-room', params.roomId, id)
        })

        return () => {
            myPeer.destroy()
            /* const tracks = myVideo.current.srcObject.getTracks();
            tracks.forEach(function(track) {
                track.stop();
              });*/
        }
    }, [])
    useEffect(() => {
        if (lastMessage) {
            if (lastMessage.callStopped) {
                navigate('/messagerie')
            }
            if (lastMessage.userConnectedToCall) {
                peer.call(lastMessage.userId, stream)
            }
            if (lastMessage.userConnectedToGroupCall) {
                console.log('conected')
                connectToNewUser(peer, lastMessage.userId, stream)
            }
            if (lastMessage.userDisconnectedGroup) {
                console.log('disconected', peers)
                var peerToDelete = peers.filter(
                    (peer) => peer.userId == lastMessage.myId
                )
                console.log(peerToDelete)
                peerToDelete[0].call.close()
                setPeers(
                    peers.filter((peer) => peer.userId != lastMessage.myId)
                )
            }
        }
    }, [lastMessage])

    const close = () => {
        socket.emit('user-disconnected-group', params.myId, params.roomId)
        navigate('/messagerie')
    }

    function connectToNewUser(myPeer, userId, stream) {
        const call = myPeer.call(userId, stream)
        const video = document.createElement('video')
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream)
        })
        call.on('close', () => {
            video.remove()
        })
        setPeers([...peers, { userId: userId, call: call }])
    }

    function addVideoStream(video, stream) {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        videoGrid.current.append(video)
    }

    return (
        <div id="firstdiv">
            <div id="myDiv">
                <div id="video-grid" ref={videoGrid}></div>
            </div>

            <div id="seconddiv">
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
