import PropTypes from 'prop-types';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { placeSelectedClass } from '../helpers/play-pause-inside-album-or-fav/player';
import { convertMillsToMin, convertMillsToSeconds } from '../helpers/songTime';
import ButtonPlay from './ButtonPlay';
import { enableRenderAlbumAct, setMusicsToPlayerAct, setSongPlayedAct } from '../actions';
import newTrackStructure from '../helpers/dataStructure/newTrackStructure';
import playedSongsStruct from '../helpers/dataStructure/playedSongsStruct';

class MusicMap extends Component {
  state = { played: { status: false, name: '' } }

  // componentDidMount() {
  //   const { played: { name } } = this.state;
  //   const { musicsToPlayer: { played: playedGlobal } } = this.props;
  //   console.log('meu playedglobal no component didmount', playedGlobal);
  //   if (name !== playedGlobal) {
  //     this.setState({ played: { ...playedGlobal } });
  //   }
  // }

  componentDidUpdate(prevProps, prevState) {
    const { played: { trackId } } = prevState;
    const { musicsToPlayer: { played: playedGlobal } } = this.props;

    if (trackId !== playedGlobal.trackId) { this.setState({ played: playedGlobal }); }
  }

  handlePlayIcon = ({ currentTarget }) => {
    const { tracks, setMusicPlayer,
      musicsToPlayer: { songs }, setPlayedSongs } = this.props;
    const songUrl = currentTarget.attributes.name.value;
    const trackData = newTrackStructure(tracks, songs, setMusicPlayer);
    const played = playedSongsStruct(trackData, songs, songUrl, setPlayedSongs);
    this.setState(({ played }));
  }

  handlePauseIcon = () => {
    const { setPlayedSongs } = this.props;
    const { played } = this.state;

    setPlayedSongs({ ...played, status: false });
    this.setState(({ played: prevPlayed }) => (
      { played: { ...prevPlayed, status: false } }
    ));
  };

  handleArtistNameLink = () => {
    const { enableRender } = this.props;
    enableRender(true);
  }

  render() {
    const {
      handleCheck,
      handleReload,
      checkedAndFavorite,
      match: { path },
      tracks,
    } = this.props;
    const { played } = this.state;
    const favoritesPath = '/favorites';

    return (
      <div>
        {
          tracks && tracks.map((artist, i) => {
            const {
              artistName,
              artworkUrl60,
              collectionName,
              collectionId,
              previewUrl,
              trackId,
              trackName,
              trackNumber,
              trackTimeMillis,
            } = artist;
            const minutes = convertMillsToMin(trackTimeMillis);
            const seconds = convertMillsToSeconds(trackTimeMillis);

            return (
              <div
                className="focusMusicRow"
                role="button"
                key={ trackId }
                tabIndex="-1"
                onClick={ (e) => placeSelectedClass(e) }
                aria-hidden
              >
                <div className="musicRow notFocusable">
                  <ButtonPlay
                    path={ path }
                    favoritesPath={ favoritesPath }
                    trackNumber={ trackNumber }
                    previewUrl={ previewUrl }
                    i={ i }
                    handlePlayIcon={ this.handlePlayIcon }
                    handlePauseIcon={ this.handlePauseIcon }
                    played={ played }
                  />

                  {
                    path === favoritesPath
                    && (
                      <div className="miniAlbumImage">
                        <img
                          src={ artworkUrl60 }
                          alt="mini album pic"
                          className="miniAlbumImage"
                        />
                      </div>
                    )
                  }

                  {
                    path === favoritesPath
                      ? (
                        <div className="musicAndArtist">
                          <div className="divToEllipsis">
                            <p className="musicName ellipsis">{ trackName }</p>
                            <Link
                              className="linkStyle focusableLink ellipsis"
                              key={ collectionId }
                              to={ `/album/${collectionId}` }
                              onClick={ this.handleArtistNameLink }
                            >
                              <p
                                className="artistName ellipsis fitLinkContent"
                              >
                                { artistName }
                              </p>
                              {' '}
                            </Link>
                          </div>
                        </div>
                      )
                      : (
                        <div className="musicAndArtistAlbum">
                          <div className="">
                            <p className="musicName ellipsis">{ trackName }</p>
                            <Link
                              className="linkStyle focusableLink"
                              key={ collectionId }
                              to="/search"
                              onClick={ this.handleArtistNameLink }
                            >
                              <p
                                className="artistName ellipsis widthRestriction"
                              >
                                { artistName }
                              </p>
                            </Link>
                          </div>
                        </div>
                      )
                  }

                  {
                    path === favoritesPath
                    && (
                      <div className="albumFilter">
                        <div className="divToEllipsis">
                          <Link
                            className="linkStyle focusableLink ellipsis"
                            key={ collectionId }
                            to={ `/album/${collectionId}` }
                          >
                            <p
                              className="artistName ellipsis"
                            >
                              {collectionName}
                            </p>
                          </Link>
                        </div>
                      </div>
                    )
                  }

                  <div className="filterRight">
                    {
                      checkedAndFavorite.includes(trackId)
                        ? (
                          <label htmlFor={ trackId } className="previewFavorite">
                            <FontAwesomeIcon
                              icon={ faHeart }
                              className="focusable heartColor"
                            />
                            <input
                              type="checkbox"
                              name=""
                              id={ trackId }
                              data-testid={ `checkbox-music-${trackId}` }
                              onChange={ () => {
                                handleCheck(artist, trackId);
                                handleReload();
                              } }
                              checked={ checkedAndFavorite.includes(trackId) }
                              hidden
                            />
                          </label>
                        )
                        : (
                          <label htmlFor={ trackId } className="previewFavorite">
                            <FontAwesomeIcon icon={ faHeart } className="heartIcon" />
                            <input
                              type="checkbox"
                              name=""
                              id={ trackId }
                              data-testid={ `checkbox-music-${trackId}` }
                              onChange={ () => {
                                handleCheck(artist, trackId);
                                handleReload();
                              } }
                              checked={ checkedAndFavorite.includes(trackId) }
                              hidden
                            />
                          </label>
                        )
                    }
                    <div className="musicDuration">
                      <p className="artistName font-link">{ `${minutes}:${seconds}` }</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

MusicMap.propTypes = {
  albumTracks: PropTypes.oneOfType([PropTypes.array]),
  checkedAndFavorite: PropTypes.oneOfType([PropTypes.array]),
  handleCheck: PropTypes.func,
  path: PropTypes.string,
  enableRender: PropTypes.func,
  handleReload: PropTypes.func,
}.isRequired;

const mapStateToProps = (state) => {
  console.log(state);
  return {
    searchAlbum: state.searchAlbum,
    responseMusics: state.responseMusics,
    musicsToPlayer: state.musicsToPlayer,
  };
};
const mapDispatchToProps = (dispatch) => ({
  enableRender: (bool) => dispatch(enableRenderAlbumAct(bool)),
  setMusicPlayer: (arr) => dispatch(setMusicsToPlayerAct(arr)),
  setPlayedSongs: (objInsidePlayed) => dispatch(setSongPlayedAct(objInsidePlayed)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MusicMap));