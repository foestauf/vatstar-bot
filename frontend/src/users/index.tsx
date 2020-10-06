import axios from 'axios';
import React, { useEffect, useState, FunctionComponent } from 'react';

export const UserList: FunctionComponent = () => {
    const [userList, setUserList] = useState([]);
    const uri = '/api/users';
    interface UserValue {
        name: String
    }

    useEffect(() => {
        async function fetch() {
            await axios
                .get(uri, { headers: { 'Content-Type': 'application/json' } })
                .then((res) => {
                    setUserList(res.data);
                })
                .catch((err) => console.log(err.response));
        }
        fetch();
    }, [])

    return (
        <div>
            <table>
                <tbody>
                    {userList.map((value: UserValue, index) => {
                        return (
                            <tr key={index}>
                                <td>{value.name}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}