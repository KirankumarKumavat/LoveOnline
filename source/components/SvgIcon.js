import React from 'react';

/**
 * 
 * @param {*} props 
 * Custom component to display SVG images
 */
const SvgIcon = (props) => {
   return (
      <props.name
         style={props.style}
         width={props.width || 25}
         height={props.height || 25}
         fill={props.color}
      />
   )
}

export default SvgIcon;