import {
    BrowserRouter as Router,
    Route,
    Routes,
    useParams,
} from 'react-router-dom'
import 'antd/dist/antd.css'
import Enregistrements from './pages/enregistrements/Enregistrements'
import FilActualite from './pages/filActualite/FilActualite'
import Inscription from './pages/inscription/Inscription'
import Messagerie from './pages/messagerie/Messagerie'
import Notification from './pages/notifications/Notification'
import Parametres from './pages/parametres/Parametres'
import Profil from './pages/profil/Profil'
import ConnexionInscription from './pages/connexionInscription/ConnexionInscription'
import ConnexionAdmin from './pages/admin/ConnexionAdmin'
import Admin from './pages/admin/Admin'
import { useSelector, useDispatch } from 'react-redux'
import Video from './pages/messagerie/components/Video'
import Modal from './pages/messagerie/components/Modal'
import { useEffect, useState } from 'react'
import { useSocket, useSocketEvent } from 'socket.io-react-hook'
import { api } from './constants/constants'
import PageTendance from './pages/components/PageTendance'
import VideoGroup from './pages/messagerie/components/VideoGroup'
import ModalGroup from './pages/messagerie/components/ModalGroup'
import Post from './pages/filActualite/components/Post'
import MPost from './pages/profil/components/MPost'
import NTFPost from './pages/notifications/components/NTFPost'
import RecupMdp from './pages/connexionInscription/RecupMdp'
import Followers from './pages/profil/components/Followers'
import PageFollow from './pages/profil/components/PageFollow'
function App() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const params = useParams()
    const [notificationsMessages, setNotificationsMessages] = useState(0)

    // const infoUser = useSelector((state) => state.infoUser)
    const [modal, setModal] = useState({
        isVisible: false,
        id_sender: 0,
        id_reciever: 0,
    })

    const [modalGroup, setModalGroup] = useState({
        isVisible: false,
        id_group: 0,
        roomId: '',
    })

    const { socket, error } = useSocket(api, {
        auth: {
            token: 'abcd',
            id: user.id,
        },
        secure: true,
    })

    const [nbrLikes, setNbrLikes] = useState(0)
    const [nbrComments, setNbrComments] = useState(0)
    const [nbrPosts, setNbrPosts] = useState(0)
    // const {sc2, deleteSentMessage, delM}=
    //useSocketEvent(socket,'delete message')
    
    const { sc, lastMessage, sendM } = useSocketEvent(
        socket,
        'message recieved'
    )

    useEffect(() => {
        if (lastMessage) {
            if (lastMessage.thisIsVideoCall) {
                if (modal.isVisible === false) {
                    console.log('appel recu')
                    setModal({
                        isVisible: true,
                        id_sender: lastMessage.id_sender,
                        id_reciever: lastMessage.id_reciever,
                        video: lastMessage.video,
                    })
                }
            }
            if (lastMessage.videoGroup) {
                setModalGroup({
                    isVisible: true,
                    id_sender: lastMessage.id_sender,
                    id_group: lastMessage.id_group,
                    roomId: lastMessage.roomId,
                })
            }
        }
    }, [lastMessage])

    return (
        <div className="App">
            <Router>
                <Modal modal={modal} setModal={setModal} />

                <ModalGroup
                    modalGroup={modalGroup}
                    setModalGroup={setModalGroup}
                />

                {!user.isLogged ? (
                    <Routes>
                        <Route path="/inscription" element={<Inscription />} />
                        <Route
                            path="/mot-de-passe-oblie"
                            element={<RecupMdp />}
                        />
                        <Route path="*" element={<ConnexionInscription />} />
                    </Routes>
                ) : (
                    <Routes>
                        <Route
                            path="/tendances"
                            element={
                                <PageTendance
                                    socket={socket}
                                    lastMessage={lastMessage}
                                    notificationsMessages={
                                        notificationsMessages
                                    }
                                    setNotificationsMessages={
                                        setNotificationsMessages
                                    }
                                    nbrLikes={nbrLikes}
                                    setNbrLikes={setNbrLikes}
                                    nbrComments={nbrComments}
                                    setNbrComments={setNbrComments}
                                    nbrPosts={nbrPosts}
                                    setNbrPosts={setNbrPosts}
                                />
                            }
                        />
                        <Route
                            path="/post/:id"
                            element={
                                <NTFPost
                                    socket={socket}
                                    lastMessage={lastMessage}
                                    notificationsMessages={
                                        notificationsMessages
                                    }
                                    setNotificationsMessages={
                                        setNotificationsMessages
                                    }
                                    nbrLikes={nbrLikes}
                                    setNbrLikes={setNbrLikes}
                                    nbrComments={nbrComments}
                                    setNbrComments={setNbrComments}
                                    nbrPosts={nbrPosts}
                                    setNbrPosts={setNbrPosts}
                                />
                            }
                        />
                        <Route
                            path="/abonnees/:id"
                            element={
                                <PageFollow
                                    socket={socket}
                                    lastMessage={lastMessage}
                                    notificationsMessages={
                                        notificationsMessages
                                    }
                                    setNotificationsMessages={
                                        setNotificationsMessages
                                    }
                                    nbrLikes={nbrLikes}
                                    setNbrLikes={setNbrLikes}
                                    nbrComments={nbrComments}
                                    setNbrComments={setNbrComments}
                                    nbrPosts={nbrPosts}
                                    setNbrPosts={setNbrPosts}
                                    isAbonnees={true}
                                />
                            }
                        />
                        <Route
                            path="/abonnements/:id"
                            element={
                                <PageFollow
                                    socket={socket}
                                    lastMessage={lastMessage}
                                    notificationsMessages={
                                        notificationsMessages
                                    }
                                    setNotificationsMessages={
                                        setNotificationsMessages
                                    }
                                    nbrLikes={nbrLikes}
                                    setNbrLikes={setNbrLikes}
                                    nbrComments={nbrComments}
                                    setNbrComments={setNbrComments}
                                    nbrPosts={nbrPosts}
                                    setNbrPosts={setNbrPosts}
                                    isAbonnements={true}
                                />
                            }
                        />

                        <Route
                            path="/enregistrements"
                            element={
                                <Enregistrements
                                    socket={socket}
                                    lastMessage={lastMessage}
                                    notificationsMessages={
                                        notificationsMessages
                                    }
                                    setNotificationsMessages={
                                        setNotificationsMessages
                                    }
                                    nbrLikes={nbrLikes}
                                    setNbrLikes={setNbrLikes}
                                    nbrComments={nbrComments}
                                    setNbrComments={setNbrComments}
                                    nbrPosts={nbrPosts}
                                    setNbrPosts={setNbrPosts}
                                />
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <FilActualite
                                    modal={modal}
                                    setModal={setModal}
                                    socket={socket}
                                    lastMessage={lastMessage}
                                    notificationsMessages={
                                        notificationsMessages
                                    }
                                    setNotificationsMessages={
                                        setNotificationsMessages
                                    }
                                    nbrLikes={nbrLikes}
                                    setNbrLikes={setNbrLikes}
                                    nbrComments={nbrComments}
                                    setNbrComments={setNbrComments}
                                    nbrPosts={nbrPosts}
                                    setNbrPosts={setNbrPosts}
                                />
                            }
                        />

                        <Route
                            path="/messagerie"
                            element={
                                <Messagerie
                                    modal={modal}
                                    socket={socket}
                                    lastMessage={lastMessage}
                                    setModal={setModal}
                                    notificationsMessages={
                                        notificationsMessages
                                    }
                                    setNotificationsMessages={
                                        setNotificationsMessages
                                    }
                                    nbrLikes={nbrLikes}
                                    setNbrLikes={setNbrLikes}
                                    nbrComments={nbrComments}
                                    setNbrComments={setNbrComments}
                                    nbrPosts={nbrPosts}
                                    setNbrPosts={setNbrPosts}
                                />
                            }
                        />
                        <Route
                            path="/appel-video/:myId/:otherId/:isVideo"
                            element={
                                <Video
                                    socket={socket}
                                    lastMessage={lastMessage}
                                />
                            }
                        />
                        <Route
                            path="/appel-video-group/:roomId/:myId"
                            element={
                                <VideoGroup
                                    socket={socket}
                                    lastMessage={lastMessage}
                                />
                            }
                        />

                        <Route
                            path="/notifications"
                            element={
                                <Notification
                                    socket={socket}
                                    lastMessage={lastMessage}
                                    notificationsMessages={
                                        notificationsMessages
                                    }
                                    setNotificationsMessages={
                                        setNotificationsMessages
                                    }
                                    nbrLikes={nbrLikes}
                                    setNbrLikes={setNbrLikes}
                                    nbrComments={nbrComments}
                                    setNbrComments={setNbrComments}
                                    nbrPosts={nbrPosts}
                                    setNbrPosts={setNbrPosts}
                                />
                            }
                        />
                        <Route
                            path="/parametres"
                            element={
                                <Parametres
                                    socket={socket}
                                    lastMessage={lastMessage}
                                    notificationsMessages={
                                        notificationsMessages
                                    }
                                    setNotificationsMessages={
                                        setNotificationsMessages
                                    }
                                    nbrLikes={nbrLikes}
                                    setNbrLikes={setNbrLikes}
                                    nbrComments={nbrComments}
                                    setNbrComments={setNbrComments}
                                    nbrPosts={nbrPosts}
                                    setNbrPosts={setNbrPosts}
                                />
                            }
                        />
                        <Route
                            path="/profil/:id"
                            element={
                                <Profil
                                    socket={socket}
                                    lastMessage={lastMessage}
                                    notificationsMessages={
                                        notificationsMessages
                                    }
                                    setNotificationsMessages={
                                        setNotificationsMessages
                                    }
                                    nbrLikes={nbrLikes}
                                    setNbrLikes={setNbrLikes}
                                    nbrComments={nbrComments}
                                    setNbrComments={setNbrComments}
                                    nbrPosts={nbrPosts}
                                    setNbrPosts={setNbrPosts}
                                />
                            }
                        />
                        <Route path="/admin" element={<ConnexionAdmin />} />
                        <Route
                            path="/home"
                            element={
                                <FilActualite
                                    modal={modal}
                                    setModal={setModal}
                                    socket={socket}
                                    lastMessage={lastMessage}
                                    notificationsMessages={
                                        notificationsMessages
                                    }
                                    setNotificationsMessages={
                                        setNotificationsMessages
                                    }
                                    nbrLikes={nbrLikes}
                                    setNbrLikes={setNbrLikes}
                                    nbrComments={nbrComments}
                                    setNbrComments={setNbrComments}
                                    nbrPosts={nbrPosts}
                                    setNbrPosts={setNbrPosts}
                                />
                            }
                        />
                        <Route
                            path="/admin-tableau-de-bord"
                            element={<Admin />}
                        />
                    </Routes>
                )}
            </Router>
        </div>
    )
}

export default App
