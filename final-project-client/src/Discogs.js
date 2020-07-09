import React from 'react';
import './Discogs.css';

import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';
const SweetAlert = withSwalInstance(swal);
const API_KEY = "YKxfsxYMdMbUwOWTDHdM";
const API_SECRET = "QVTTQqoViZxsnwPsGadHQPPxtSANVwCS";
class Discogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tracks_data: [], // will contain data from server
            isLoaded: false,  // will be true after data have been received from server
            error: null, // no errors yet !
            isadded: false,
            isChanged: false,
            playid: -1
        }
        this.addBanda = this.addBanda.bind(this);
        this.getTracksChange = this.getTracksChange.bind(this);
    }

    playlistOptions() {
        var optionsplaylist = [<option key={1} value={-1} >{'--Select Playlist--'}</option>]
        if (this.state.playlist) {
            let optionsp = this.state.playlist.map((i, ind) => {
                //var selected =  ? ' selected' : ''; 
                return <option key={ind} value={i.id} >{i.title}</option>
            })

            optionsplaylist.push(optionsp)
            console.log(optionsplaylist)
        } else {
            this.getPlaylists();
        }
        return (
            <select  className="select__list" onChange={this.getTracksChange} value={this.state.playid} >
                {optionsplaylist}
            </select>
        );

    }

    getTracksChange(event) {
        const val = event.target.value
        this.setState({
            playid: val
        })
    }
    componentDidUpdate(preStates) {
        //if(this.state)
        console.log(preStates, this.state);
    }

    searchData = () => {

        let url = `https://api.discogs.com/database/search?key=${API_KEY}&secret=${API_SECRET}&artist=`
        let artist = document.getElementById("artist").value;


        fetch(url + artist + '&country=india')
            .then(
                (response) => {
                    if (response.ok) {
                        // get only JSON data returned from server with .json()
                        response.json().then(json_response => {
                            console.log(json_response)
                            this.setState({
                                //results: json_response, // data received from server
                                tracks_data: json_response,
                                isLoaded: true,  // we got data
                                error: null // no errors
                            })
                            console.log(this.state.tracks_data);
                        }
                        )

                    }
                    else {
                        // handle errors, for example 404
                        response.json().then(json_response => {
                            this.setState({
                                isLoaded: false,
                                error: json_response,   // something in format  {message: "city not found", db_data:{}}
                                tracks_data: {}, // no data received from server

                            });
                        })
                    }
                },

                (error) => {
                    // Basically fetch() will only reject a promise if the URL is wrong, the user is offline,
                    // or some unlikely networking error occurs, such a DNS lookup failure.
                    this.setState({
                        isLoaded: false,
                        error: { message: "AJAX error, URL wrong or unreachable, see console" }, // save the AJAX error in state for display below
                        tracks_data: {}, // no data received from server

                    });
                }
            )
    }

    getPlaylists() {


        fetch('http://localhost:3001/playlists')
            .then(
                (response) => {
                    if (response.ok) {
                        response.json().then(data => {

                            console.log(data)
                            let playlists = [];
                            playlists = data.db_data.map(i => { return { id: i.id, title: i.title } })
                            this.setState({
                                playlist: playlists

                            })
                        });
                    }
                });



    }


    addBanda = (id) => {

        let that = this;
        let track = this.state.tracks_data.results.filter(i => i.id === id)[0]
        fetch('http://localhost:3001/tracks', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {

                    "playlist_id": that.state.playid,
                    "title": track.title,
                    "uri": track.uri,
                    "master_id": track.master_id
                }
            )
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            // alert('changing')
            that.setState({ isadded: true, isChanged: true })
        });

    }
    render() {
        if (this.state.isChanged === true) {
            if (this.state.isadded === true) {
                return (
                    <div>

                        <SweetAlert
                            show={this.state.isChanged}
                            title="Message"
                            text="Added Successfully"
                            onConfirm={() => this.setState({ isChanged: false })}
                        />
                    </div>
                )
            } else {
                return (
                    <div>

                        <SweetAlert
                            show={this.state.isChanged}
                            title="Message"
                            text="Something Went Wrong."
                            onConfirm={() => this.setState({ isChanged: false })}
                        />
                    </div>
                )
            }
        }
        else
            if (this.state.tracks_data.length !== 0) {
                let array_data = [];
                console.log("track data")
                console.log("total tracks " + this.state.tracks_data.results.length)
                for (let i = 0; i < this.state.tracks_data.results.length; i++) {
                    array_data.push(
                        <tr key={i}>
                            <td>
                                <div className="row">
                                    <div className="col-6" >
                                        <h3><b>{this.state.tracks_data.results[i].title}</b></h3>
                                        <img src={this.state.tracks_data.results[i].thumb} alt={this.state.tracks_data.results[i].thumb} />
                                    </div>
                                    <div className="col-6">
                                        <p>Style: {this.state.tracks_data.results[i].genre[0]}</p>
                                        <p>Format: {this.state.tracks_data.results[i].format[0]}</p>
                                        <p>{this.state.tracks_data.results[i].country} - {this.state.tracks_data.results[i].year}</p>
                                        <p>{this.state.tracks_data.results[i].id}</p>
                                        <p>URI: {this.state.tracks_data.results[i].uri} </p>
                                        <a href={"http://www.discogs.com/" + this.state.tracks_data.results[i].uri}>More Information</a>
                                    </div>
                                </div>
                            </td>
                            <td>{this.state.tracks_data.results[i].master_id}</td>

                            <td>{this.playlistOptions()} <button className="submit" onClick={() => this.addBanda(this.state.tracks_data.results[i].id)}>Add</button></td>
                        </tr>
                    )
                }
                return (
                    <div className="panel350 ">
                        <input className="form__input" type="text" id="artist" placeholder="Enter Indian Artist Name.." />
                        
                        <button className="submit" onClick={() => this.searchData()}>submit</button>
                        <table className="table">
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <th>Information</th>
                                    <th>Master ID</th>
                                </tr>
                                {array_data}
                            </tbody>
                        </table>
                    </div>
                );
            }
            else {
                return (
                    <div className="disc">
                        <input className="form__input" type="text" id="artist" placeholder="Search here...."/>
                        <b>           </b>
                        
                        <button className="submit" onClick={() => this.searchData()}>Submit</button>
                    </div>
                );
            }
    }
}
export default Discogs;


