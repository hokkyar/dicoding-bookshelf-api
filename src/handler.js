const books = require('./books')
const { nanoid } = require('nanoid')

// ADD BOOK HANDLER
const addBookHandler = (request, h) => {
  // get all body request
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const id = nanoid(16)
  const finished = (pageCount === readPage)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  // push newBook to books
  if (name === undefined || name === '') {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400)
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt }
  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0
  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    }).code(201)
  }

  // generic error
  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  }).code(500)
}

// GET ALL BOOKS HANDLER
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query
  const displayBooks = []
  let filteredBooks = []

  if (name === undefined && reading === undefined && finished === undefined) {
    books.forEach((book) => {
      const { id, name, publisher } = book
      displayBooks.push({ id, name, publisher })
    })
  }

  if (name !== undefined) {
    filteredBooks = books.filter((book) => {
      const queryBookName = name.toLowerCase()
      const bookName = book.name.toLowerCase()
      return new RegExp('\\b' + queryBookName + '\\b').test(bookName)
    })

    if (filteredBooks.length === 0) {
      return h.response({
        status: 'success',
        data: {
          books: displayBooks
        }
      }).code(200)
    }
  }

  if (reading !== undefined) {
    if (filteredBooks.length > 0) {
      filteredBooks = (parseInt(reading) === 0) ? filteredBooks.filter((book) => !book.reading) : filteredBooks.filter((book) => book.reading)
      if (filteredBooks.length === 0) {
        return h.response({
          status: 'success',
          data: {
            books: displayBooks
          }
        }).code(200)
      }
    } else {
      filteredBooks = (parseInt(reading) === 0) ? books.filter((book) => !book.reading) : books.filter((book) => book.reading)
    }
  }

  if (finished !== undefined) {
    if (filteredBooks.length > 0) {
      filteredBooks = (parseInt(finished) === 0) ? filteredBooks.filter((book) => !book.finished) : filteredBooks.filter((book) => book.finished)
      if (filteredBooks.length === 0) {
        return h.response({
          status: 'success',
          data: {
            books: displayBooks
          }
        }).code(200)
      }
    } else {
      filteredBooks = (parseInt(finished) === 0) ? books.filter((book) => !book.finished) : books.filter((book) => book.finished)
    }
  }

  if (filteredBooks.length > 0) {
    displayBooks.push(filteredBooks)
    const queryResultBooks = []
    displayBooks[0].forEach((book) => {
      const { id, name, publisher } = book
      queryResultBooks.push({ id, name, publisher })
    })
    return h.response({
      status: 'success',
      data: {
        books: queryResultBooks
      }
    }).code(200)
  }

  return h.response({
    status: 'success',
    data: {
      books: displayBooks
    }
  }).code(200)
}

// GET BOOK BY ID HANDLER
const getBookByIdHandler = (request, h) => {
  const { id } = request.params
  const book = books.find((book) => book.id === id)
  if (book !== undefined) {
    return h.response({
      status: 'success',
      data: {
        book
      }
    }).code(200)
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404)
}

// EDIT BOOK BY ID HANDLER
const editBookByIdHandler = (request, h) => {
  // get id from params
  const { id } = request.params
  // get data from body
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const finished = (readPage === pageCount)
  const updatedAt = new Date().toISOString()

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400)
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  const index = books.findIndex((book) => book.id === id)
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt
    }
    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    }).code(200)
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  }).code(404)
}

// DELETE BOOK BY ID HANDLER
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params
  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
    books.splice(index, 1)
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    }).code(200)
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  }).code(404)
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
