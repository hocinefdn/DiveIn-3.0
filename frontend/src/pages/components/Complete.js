import React, { useState, useEffect } from 'react'
import { Input, AutoComplete } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { api } from '../../constants/constants'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setProp } from '../../redux/actions/userActions'

const axios = require('axios')

function Complete() {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const renderTitle = (title) => (
        <span>
            {title}
            <a
                style={{
                    float: 'right',
                }}
                href="https://www.google.com/search?q=antd"
                target="_blank"
                rel="noopener noreferrer"
            >
                more
            </a>
        </span>
    )

    const renderItem = (title, id, count) => ({
        value: title,
        label: (
            <Link to={'/profil/' + id}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    {title}
                    <span>
                        <UserOutlined /> {count}
                    </span>
                </div>
            </Link>
        ),
    })

    const options = [
        /* {
        label: renderTitle('Libraries'),
        options: [
            renderItem('AntDesign', 10000),
            renderItem('AntDesign UI', 10600),
        ],
    },
    {
        label: renderTitle('Solutions'),
        options: [
            renderItem('AntDesign UI FAQ', 60100),
            renderItem('AntDesign FAQ', 30010),
        ],
    },
    {
        label: renderTitle('Articles'),
        options: [renderItem('AntDesign design language', 100000)],
    },*/
        {
            label: renderTitle('users'),
            options: users
                ? users
                      .filter((user) =>
                          (
                              user.firstname +
                              ' ' +
                              user.lastname +
                              ' ' +
                              user.email
                          )
                              .toLowerCase()
                              .includes(search.toLowerCase())
                      )
                      .map((user) => {
                          return renderItem(
                              `${user.lastname} ${user.firstname}`,
                              user.id,
                              parseInt(user.nbr)
                          )
                      })
                : null,
        },
    ]

    function getUsers() {
        axios.get(`${api}user/getUsers/${user.id}`).then((res) => {
            setUsers(res.data)
            dispatch(setProp('users', res.data))
        })
    }
    useEffect(() => {
        getUsers()
    }, [])

    return (
        <AutoComplete
            dropdownClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={230}
            style={{ width: 230 }}
            className="barre"
            options={options}
        >
            <Input
                size="large"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher sur DiveIn"
                className="inputrecherche"
            />
        </AutoComplete>
    )
}
export default Complete
