'use strict';

/* !
 * Ported from feed-furious 1.0.0 to support async-ed camaro v4+
 * Licensed MIT (c) 2017 Tuan Anh Tran <https://tuananh.org/>
 * https://github.com/tuananh/feed-furious
 */


const { transform } = require('camaro');

const template = {
  rss: {
    items: ['//item', {
      title: 'title',
      link: 'link',
      description: 'description',
      content: 'content:encoded',
      date: 'pubDate',
      id: 'guid',
      categories: ['category', '.']
    }]
  },
  atom: {
    items: ['//entry', {
      id: 'id',
      title: 'title',
      date: 'published',
      description: 'summary',
      content: 'content',
      link: 'link',
      categories: ['category', '@term']
    }]
  }
};

const detectFeedType = async xml => {
  const sample = await transform(xml, {
    rss: 'rss/channel/title',
    atom: 'feed/title'
  });

  if (sample.rss) return 'rss';
  if (sample.atom) return 'atom';
  throw new Error('unknown feed type');
};

const parseFeed = async xml => {
  const type = await detectFeedType(xml);
  const output = await transform(xml, template[type]);
  return output;
};

module.exports = parseFeed;