import React from 'react';
import './header.css';
class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = { username: this.props.username }
        
    }

    changeName = (a) => {
        this.setState({ username: a })
    }
    render() {
        return (
            <div className="top1" style={{backgroundColor:"#292c2f",padding:"5px"}}>
                <img src="121.png" alt="some logo" style={{ width: '150px' }}></img>
                <h1>Soul<span>Music</span></h1>
               
            </div>
        )
    }
}
export default Header;