import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';


//-----------------------------------------------------
// ROOT component . Top level component containing whole page
class Root extends React.Component {
    render() {
        return (
            <div>
                <App />
            </div>
        )
    }
}
ReactDOM.render(<Root />, document.getElementById('root'));


