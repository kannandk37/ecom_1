import React from 'react'
import { useNavigate } from 'react-router-dom'

const UsersList = () => {
    const navigate = useNavigate();
  return (
    <div onClick={() => navigate('/dashboard/users/add')}>Users

    </div>
  )
}

export default UsersList