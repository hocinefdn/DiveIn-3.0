import React from 'react'
import { Menu } from 'antd'
import {
    EditOutlined,
    FormatPainterOutlined,
    LockOutlined,
    QuestionCircleOutlined,
    StopOutlined,
    UserDeleteOutlined,
} from '@ant-design/icons'
import EditerProfil from './EditerProfil'
import MotDePasse from './MotDePasse'
import ListBloque from './ListBloque'
import ContactezNous from './ContactezNous'
import DesactiverCompte from './DesactiverCompte'
const { SubMenu } = Menu

// submenu keys of first level
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4']
function ListParametres() {
    const [openKeys, setOpenKeys] = React.useState(['sub1'])

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys)
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
        }
    }
    return (
        <div>
            <Menu
                mode="inline"
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                // style={{ width: 256 }}
                className="w-full text-lg"
            >
                <SubMenu
                    key="editerLeProfil"
                    icon={<EditOutlined />}
                    title="Editer profil"
                >
                    <EditerProfil />
                </SubMenu>

                <SubMenu
                    key="changerMotPasse"
                    icon={<LockOutlined />}
                    title="Changer le mot de passe"
                >
                    <MotDePasse />
                </SubMenu>
                <SubMenu
                    key="listBloque"
                    icon={<StopOutlined />}
                    title="Liste bloqué"
                >
                    <ListBloque />
                </SubMenu>

                <SubMenu
                    key="contactezNous"
                    icon={<QuestionCircleOutlined />}
                    title="Contactez-nous"
                >
                    <ContactezNous />
                </SubMenu>
                <SubMenu
                    key="desactiverCompte"
                    icon={<UserDeleteOutlined />}
                    title="Désactiver le compte"
                >
                    <DesactiverCompte />
                </SubMenu>
            </Menu>
        </div>
    )
}

export default ListParametres
