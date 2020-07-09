import React from 'react';
import './playlist.css';

import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';

const SweetAlert = withSwalInstance(swal);

class Playlist extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            playid: -1,
            tracks: [],
            isDelete: false
        }


        this.playlistOptions = this.playlistOptions.bind(this)
        this.getPlaylists = this.getPlaylists.bind(this)
        this.getTracks = this.getTracks.bind(this)
        this.getTracksChange = this.getTracksChange.bind(this)

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
    getTracksChange(event) {
        const val = event.target.value
        this.getTracks(val)
    }
    getTracks(id) {
        const that = this;
        const val = id
        fetch('http://localhost:3001/playlist/tracks?id=' + id)
            .then(
                (response) => {
                    if (response.ok) {
                        response.json().then(data => {

                            console.log(data)
                            let tracks = [];
                            tracks = data.db_data
                            that.setState({
                                tracks: tracks,
                                playid: val
                            })
                        });
                    } else {
                        that.setState({
                            tracks: [],
                            playid: val
                        })
                    }
                });
    }

    deletetrack(id) {
        const that = this;
        fetch('http://localhost:3001/detete/tracks/' + id)
            .then(
                (response) => {
                    if (response.ok) {
                        response.json().then(data => {
                            this.getTracks(this.state.playid)
                        });
                    } else {
                        that.setState(
                            that.state
                        )
                    }
                });
    }

    renderPlaylist() {
        const tracks = this.state.tracks.map((i, ind) => <tr key={i}>
            <th scope="row">{ind + 1}</th>
            <td>{i.title}</td>
            <td>{i.uri}</td>
            <td>{i.master_id}</td>
            <td><button onClick={() => this.deletetrack(i.id)}>Delete</button></td>
        </tr>)
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">Uri</th>
                        <th scope="col">MasterId</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tracks}
                </tbody>
            </table>
        )
    }

    playlistOptions() {
        const optionsplaylist = [<option key={1} value={-1} >{'--Select Playlist--'}</option>]
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
            <select onChange={this.getTracksChange} value={this.state.playid} >
                {optionsplaylist}
            </select>
        );

    }

    render() {
        if (this.state.isDelete) {
            return (
                <div>

                    <SweetAlert
                        show={this.state.isDelete}
                        title="Message"
                        text="Added Successfully"
                        onConfirm={() => this.setState({ isDelete: false })}
                    />
                </div>
            )
        } else {
            return (
                <div >
                    <div className="col-12">

                        {this.playlistOptions()}


                    </div>

                    {this.renderPlaylist()}
                </div>
            );
        }

    }
}

export default Playlist;
