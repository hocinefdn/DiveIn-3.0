import React, { useEffect, useState, useRef } from 'react'

import { useAudioRecorder } from '@sarafhbk/react-audio-recorder'

import { AudioOutlined, AudioTwoTone } from '@ant-design/icons'
function SoundRecorder({ setAudioFile, setIsAudio }) {
    const audioRef = useRef()
    const [isRecording, setIsRecording] = useState(false)
    const {
        audioResult,
        timer,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        status,
        errorMessage,
    } = useAudioRecorder()

    function stop() {
        setIsRecording(false)
        stopRecording()

        fetch(audioResult)
            .then((r) => r.blob())
            .then((blobFile) => {
                setAudioFile(blobFile)
            })
        setIsAudio(true)
    }
    useEffect(() => {
        fetch(audioResult)
            .then((r) => r.blob())
            .then((blobFile) => {
                setAudioFile(blobFile)
            })
    }, [audioResult])

    return (
        <div>
            <audio ref={audioRef} src={audioResult} />
            <div>
                <div>
                    {isRecording ? (
                        <button onClick={stop}>
                            <AudioTwoTone className="p-2 bg-blue-200 rounded-2xl" />
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                startRecording()
                                setIsRecording(true)
                            }}
                        >
                            <AudioOutlined className="text-sky-600" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SoundRecorder
