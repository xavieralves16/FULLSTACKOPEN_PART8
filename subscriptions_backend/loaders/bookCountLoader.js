const DataLoader = require('dataloader');
const Book = require('../models/book');

const createBookCountLoader = () =>
  new DataLoader(async (authorNames) => {
    const books = await Book.find({ author: { $in: authorNames } });

    const countMap = authorNames.map(
      (name) => books.filter((b) => b.author === name).length
    );

    return countMap;
  });

module.exports = createBookCountLoader;