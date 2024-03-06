import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { baseUrl, apiPrefixV1 } from '../../../constants/AppConstants';
import { logout } from '../../../redux/slices/authSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import './ComplaintDetailsComponent.css'
function ComplaintDetailsComponent() {
    return (
        <div>ComplaintDetailsComponent</div>
    )
}

export default ComplaintDetailsComponent