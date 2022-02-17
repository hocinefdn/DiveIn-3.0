import React, { useState, useEffect, useRef } from 'react'
import useUserMedia from 'react-use-user-media'

const constraints = { audio: true }

function SoundRecorder({ setAudioFile }) {
    const [data, setData] = useState([])
    const audioRef = useRef()
    const { state, stream } = useUserMedia(constraints)
    const [mediaRecorder, setMediaRecorder] = useState()
    // Start the recording.
    function startRecording() {
        mediaRecorder.addEventListener('start', (e) => {
            // Empty the collection when starting recording.
            setData([])
        })

        mediaRecorder.addEventListener('dataavailable', (event) => {
            // Push recorded data to collection.
            setData([...data, event.data])
        })

        // Create a Blob when recording has stopped.
        mediaRecorder.addEventListener('stop', () => {
            const blob = new Blob(data, {
                type: 'audio/mp3',
            })
            setAudioFile(
                new File([blob], 'image.mp3', {
                    type: blob.type,
                })
            )
        })
        mediaRecorder.start()
    }
    function stopRecording() {
        mediaRecorder.stop()
    }

    useEffect(() => {
        if (state == 'resolved' && stream) {
            setMediaRecorder(new MediaRecorder(stream))
            //audioRef.src = stream
        }
    }, [stream])

    return (
        <div>
            <div>
                <div>
                    <button onClick={startRecording}>Start</button>
                    <button onClick={stopRecording}>Stop</button>
                </div>
                <audio controls Ref={audioRef} src={stream}></audio>
            </div>
        </div>
    )
}

export default SoundRecorder
