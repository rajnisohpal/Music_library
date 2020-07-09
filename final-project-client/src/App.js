import React from 'react';
import './App.css';
import Discogs from './Discogs';
import Playlist from './playlist';
import Header from './Header';
import Footer from './Footer';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tabComp: 'playlist'
    }
    this.changeTab = this.changeTab.bind(this);
    this.renderTab = this.renderTab.bind(this);
  }


  changeTab(tab) {

    this.setState({ tabComp: tab })
  }

  renderTab() {
    switch (this.state.tabComp) {
      case 'discog': return (<Discogs />);
      case 'playlist': return (<Playlist />);
      default: return (<Discogs />);
    }
  }
  render() {
    return (
      <div >
        <Header username="kiran" />
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a href=" "   className="nav-link" onClick={() => this.changeTab('discog')}>Discogs
                </a>
              </li>
              <li className="nav-item">
                <a href=" " className="nav-link" onClick={() => this.changeTab('playlist')}>Playlist </a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="row">
          <div className="col-6" >
            <Playlist />
          </div>
          <div className="col-6" >
            <Discogs />
          </div>
        
        {/* {this.renderTab()} */}
        </div>
        <div>
        <Footer />
        </div>
      </div>
    );
  }
}

export default App;
