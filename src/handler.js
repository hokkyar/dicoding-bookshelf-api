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
  if (name === undefined) {
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

// GET ALL BOOK HANDLER
const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query
  const displayBook = []
  if (name !== undefined) {
    books.forEach((book) => {
      if (book.name.toLowerCase().includes(name.toLowerCase())) {
        const id = book.id
        const name = book.name
        const publisher = book.publisher
        const tempBook = { id, name, publisher }
        displayBook.push(tempBook)
      }
    })
    return h.response({
      status: 'success',
      data: {
        books: displayBook
      }
    }).code(200)
  }

  if (reading !== undefined) {
    if (parseInt(reading) === 0) {
      books.forEach((book) => {
        if (!book.reading) {
          const id = book.id
          const name = book.name
          const publisher = book.publisher
          const tempBook = { id, name, publisher }
          displayBook.push(tempBook)
        }
      })
      return h.response({
        status: 'success',
        data: {
          books: displayBook
        }
      }).code(200)
    } else {
      books.forEach((book) => {
        if (book.reading) {
          const id = book.id
          const name = book.name
          const publisher = book.publisher
          const tempBook = { id, name, publisher }
          displayBook.push(tempBook)
        }
      })
      return h.response({
        status: 'success',
        data: {
          books: displayBook
        }
      }).code(200)
    }
  }

  if (finished !== undefined) {
    if (parseInt(finished) === 0) {
      books.forEach((book) => {
        if (!book.finished) {
          const id = book.id
          const name = book.name
          const publisher = book.publisher
          const tempBook = { id, name, publisher }
          displayBook.push(tempBook)
        }
      })
      return h.response({
        status: 'success',
        data: {
          books: displayBook
        }
      }).code(200)
    } else {
      books.forEach((book) => {
        if (book.finished) {
          const id = book.id
          const name = book.name
          const publisher = book.publisher
          const tempBook = { id, name, publisher }
          displayBook.push(tempBook)
        }
      })
      return h.response({
        status: 'success',
        data: {
          books: displayBook
        }
      }).code(200)
    }
  }

  books.forEach((book) => {
    const id = book.id
    const name = book.name
    const publisher = book.publisher
    const tempBook = { id, name, publisher }
    displayBook.push(tempBook)
  })
  return h.response({
    status: 'success',
    data: {
      books: displayBook
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

module.exports = { addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
