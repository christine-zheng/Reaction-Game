import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import Game from './Game';

import { Parallax, ParallaxLayer } from '@react-spring/parallax';
// import moon from '/moon.png';
// import land from '/land.png';
// import cat from '../../public/cat.gif';

/**
 * COMPONENT
 */
export const Home = (props) => {
  // parallax effect: so we can use scrollTo property
  const ref = useRef();

  const [game, setGame] = useState(false);
  const { username } = props;

  if (!game) {
    return (
      <main>
        {/* react-spring parallax */}
        {/* https://react-spring.dev/components/parallax#parallax */}
        <Parallax pages={4} ref={ref}>
          <ParallaxLayer
            offset={0}
            speed={1}
            factor={2}
            style={{
              backgroundImage: `url(/moon.png)`,
              backgroundSize: 'cover',
            }}
          />

          <ParallaxLayer
            offset={2}
            speed={1}
            factor={4}
            style={{
              backgroundImage: `url(/land.png)`,
              backgroundSize: 'cover',
            }}
          />

          <ParallaxLayer
            sticky={{ start: 0.9, end: 2.5 }}
            style={{ textAlign: 'center' }}
          >
            <img src="/cat.gif" />
          </ParallaxLayer>

          <ParallaxLayer
            offset={0.2}
            speed={0.05}
            onClick={() => ref.current.scrollTo(3)}
          >
            <h1 className="homePage">Welcome, {username.toUpperCase()}</h1>
          </ParallaxLayer>

          <ParallaxLayer
            offset={3}
            speed={2}
            onClick={() => ref.current.scrollTo(3)}
          >
            <div id="format-home">
              <p className="homePage">Play to see your reaction time!</p>
              <p id="instruction" className="homePage">
                Click on the box when you see the color changes.
              </p>
              <button
                type="button"
                id="start-btn"
                className="all-btns"
                onClick={() => setGame(true)}
              >
                Start Game!
              </button>
            </div>
          </ParallaxLayer>
        </Parallax>
      </main>
    );
  }
  return <Game />;
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(Home);
