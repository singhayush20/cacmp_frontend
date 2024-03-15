import React from 'react'
import { BounceLoader } from 'react-spinners'
import './LoadingIndicator2.css'
function LoadingIndicator2({ color, size }) {
    return (
      
            <div className="loading-indicator">
                <BounceLoader
                    color={color}
                    size={size}
                />
            </div>
      
    )
}

export default LoadingIndicator2
