import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AlbumHeaderDetails from './AlbumHeaderDetails';
import TopsideBar from './TopsideBar';

class AlbumHeader extends Component {
  render() {
    const { responseMusics:
      { albumCollection:
        { artistName, collectionName, artworkUrl100 },
      },
    } = this.props;

    return (
      <section
        className="albumHeader gradHeader"
        data-testid="page-album"
      >
        <TopsideBar />
        <h1 className="titlePage" hidden>Album page</h1>
        <div className="contentAlbum">
          <div className="albumTitle">
            <div className="albumImage">
              <img
                src={ artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg') }
                alt={ `Album cover of ${artistName}` }
              />
            </div>
            <div className="albumDetails">
              <h6 className="albumTitleFixed">ALBUM</h6>
              <h1
                className="albumName albumTitleFixed ellipsis"
                data-testid="album-name"
                hidden
              >
                {`Collection Name ${collectionName}`}
              </h1>

              <h2
                className="albumName albumTitleFixed"
              >
                {collectionName}
              </h2>
              <AlbumHeaderDetails { ...this.props } />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

AlbumHeader.propTypes = {
  album: PropTypes.oneOfType([
    PropTypes.array,
  ]),
}.isRequired;

const mapStateToProps = (state) => ({
  responseMusics: state.responseMusics,
});

export default connect(mapStateToProps)(AlbumHeader);
