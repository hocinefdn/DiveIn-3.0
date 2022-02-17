import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
function BarreRecherche() {
    return (
        <div className="barre">
            <div>
                <input
                    type="text"
                    placeholder="Recherche"
                    className="inputrecherche"
                />
            </div>
            <div className="flex justify-center items-center w-30 h-8 bg-blue-100 rounded-xl">
                <SearchIcon className=" mr-1.5 ml-1.5" />
            </div>
        </div>
    )
}

export default BarreRecherche
