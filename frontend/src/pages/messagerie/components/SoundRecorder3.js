import React, { useState, useEffect, useRef } from 'react'
import { useAudioRecorder } from '@sarafhbk/react-audio-recorder'

function SoundRecorder({ setAudioFile }) {
    const [data, setData] = useState([])
    const audioRef = useRef()
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
            setAudioFile(blob)
        })
        mediaRecorder.start()
    }
    function stopRecording() {
        mediaRecorder.stop()
    }

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => setMediaRecorder(new MediaRecorder(stream)))
    }, [])

    return (
        <div>
            <div>
                <div>
                    <button onClick={startRecording}>Start</button>
                    <button onClick={stopRecording}>Stop</button>
                </div>
            </div>
        </div>
    )
}

export default SoundRecorder
