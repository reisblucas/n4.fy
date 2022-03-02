import React, { Component } from 'react';
import '../styles/header.css';
import PropTypes from 'prop-types';
import { getUser } from '../services/userAPI';
import { getFavoriteSongs } from '../services/favoriteSongsAPI';
import SidebarHeaderTopside from './SidebarHeaderTopside';
import FavSideList from './FavSideList';

class Header extends Component {
  constructor() {
    super();

    console.log('linee 1333333333333', this.props);

    this.state = {
      isLoading: true,
      name: '',
      image: 'https://i.pinimg.com/474x/86/0d/cd/860dcdf5cd536bfd86d8fc86efdbdd18.jpg',
      favoriteSongs: [],
    };

    this.catchUser = this.catchUser.bind(this);
    this.pathVerifier = this.pathVerifier.bind(this);
    this.saveUrl = this.saveUrl.bind(this);
    this.forceReloadVerifier = this.forceReloadVerifier.bind(this);
  }

  componentDidMount() {
    this.catchUser();
    this.fetchFavoriteSongs();
    this.saveUrl();
  }

  fetchFavoriteSongs = async () => {
    const favSongs = await getFavoriteSongs();
    this.setState({
      favoriteSongs: favSongs,
    });
  }

  async catchUser() {
    this.setState({ isLoading: true });
    const user = await getUser();

    this.setState(() => {
      if (user.image.length > 0) {
        return ({
          isLoading: false,
          name: user.name,
          image: user.image,
        });
      }
      return {
        isLoading: false,
        name: user.name,
      };
    });
  }

  saveUrl() {
    const { match: { url } } = this.props;
    this.setState({ url }, () => this.pathVerifier());
  }

  pathVerifier() {
    const { match: { url: urlSideLink } } = this.props;
    const { url: urlCurrentPage } = this.state;

    if (urlCurrentPage !== urlSideLink) {
      window.location.reload();
    }
  }

  forceReloadVerifier() {
    const { forceReload, handleReload } = this.props;
    const ms500 = 500;

    if (forceReload) {
      this.setState((prevState) => ({
        reload: !prevState.reload,
        isLoading: true,
      }), () => {
        this.fetchFavoriteSongs();
        setTimeout(() => this.setState({ isLoading: false }), ms500);
      });
      handleReload();
    }
  }

  render() {
    const { favoriteSongs, isLoading } = this.state;
    console.log('reloaded', this.props);
    this.forceReloadVerifier();

    return (
      <header className="header-hero" data-testid="header-component">
        <SidebarHeaderTopside { ...this.state } />

        <hr className="sideBarHorizontalRow" />

        <div className="sideFavSongsContainer">

          {
            isLoading
              ? (
                <FavSideList
                  favoriteSongs={ favoriteSongs }
                />
              )
              : (
                <FavSideList
                  favoriteSongs={ favoriteSongs }
                />
              )
          }
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  url: PropTypes.string,
}.isRequired;

export default Header;
