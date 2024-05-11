import React from 'react'
import {ScaleLoader } from 'react-spinners'
import './LoadingIndicator1.css'
function LoadingIndicator1({ color, size }) {
    return (
      
            <div className="loading-container">
                <ScaleLoader
                    color={color}
                    size={size}
                />
            </div>
      
    )
}

export default LoadingIndicator1
