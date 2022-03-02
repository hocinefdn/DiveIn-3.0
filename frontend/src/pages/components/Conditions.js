import React from 'react'

function Conditions() {
    return (
        <div className="">
            <div className="w-1/2 mr-auto ml-auto p-4 border border-solid m-4">
                <div className="p-2">
                    <div>
                        <span className="font-bold text-sky-400">DiveIn</span>
                        Social Network is the result of a pedagogical project,
                        designed and implemented by Master degree students (M2
                        ISI) of Information Systems Engineering – Computer
                        Science Department – University Mouloud Mammeri of Tizi
                        Ouzou – ALGERIA.
                    </div>
                    <div className="font-bold  text-red-600">
                        THIS IS NOT A PROFESSIONAL NOR A COMMERCIAL APPLICATION.
                    </div>
                    <div>
                        Please do note that this is a test platform, and that
                        your subscription or your connection is exclusively
                        under your own responsibility. Authors do not guarantee
                        any protection or any security to any information you
                        decide to share or to publish on this platform.
                    </div>
                </div>

                <hr />
                <div className="p-2">
                    <div>
                        Le réseau social DiveIn est le résultat d’un projet
                        pédagogique conçu et développé par les étudiant.e.s de
                        M2 Ingénierie des Systèmes d’Information – Département
                        d’Informatique – Université Mouloud MAMMERI de Tizi
                        Ouzou – ALGERIE
                    </div>
                    <div className="font-bold text-red-600">
                        CECI N’EST PAS UNE APPLICATION PROFESSIONNELLE NI
                        COMMERCIALE
                    </div>
                    <div>
                        Veuillez noter que ceci est une plate-forme de test, et
                        que votre inscription est exclusivement sous votre
                        propre responsabilité. Les auteurs ne garantissent ni la
                        protection ni la sécurité de toute information que vous
                        décidez de partager ou de publier sur cette plate-forme.
                    </div>
                </div>
                <div>
                    <span>J'ai bien compris et j'accepte</span>
                    <input type="checkbox" className="ml-2" name="cocher" />
                    <div className="mt-2">
                        <a href="/" className="bg-sky-400 p-2 rounded-md ">
                            Continuer
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Conditions
