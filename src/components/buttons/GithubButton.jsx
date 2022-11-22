import React from 'react';
import { VscGithub } from 'react-icons/vsc';

function GithubButton() {
  return (
    <a
      href="https://github.com/reisblucas"
      target="_blank"
      rel="noopener noreferrer"
      className="cpb gh-in pbr"
    >
      <VscGithub />
    </a>
  );
}

export default GithubButton;
