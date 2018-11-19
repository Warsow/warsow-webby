/**
 * Copyright (c) 2018 Aleksej Komarov
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import React from 'react';

const COLOR_TOKEN_REGEX = /\^[0-9\^]/g;
const COLOR_TOKEN_MAP = {
  '^0': 'rgba(255, 255, 255, 0.5)', // black
  '^1': '#f00',
  '^2': '#0f0',
  '^3': '#ff0',
  '^4': '#00f',
  '^5': '#0ff',
  '^6': '#f0f',
  '^7': '#fff',
  '^8': '#f80',
  '^9': 'rgba(255, 255, 255, 0.6)',
};

export default function ColorTokens(props) {
  const strings = props.value.split(COLOR_TOKEN_REGEX);
  const tokens = props.value.match(COLOR_TOKEN_REGEX);
  return strings
    // Zip tokens and strings together
    .reduce((pairs, str, i) => {
      // Get token
      const token = tokens && tokens[i - 1];
      // Handle escape sequence
      if (token === '^^') {
        str = '^' + str;
      };
      // Skip empty strings
      if (!str) {
        return pairs;
      }
      // Add next pair
      pairs.push([token, str]);
      return pairs;
    }, [])
    // Map pairs to elements
    .map(([token, str], i) => {
      if (!token) {
        return str;
      }
      const color = COLOR_TOKEN_MAP[token];
      return (
        <span key={i} style={{ color }}>{str}</span>
      );
    });
}
