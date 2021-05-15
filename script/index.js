//this function to handle database
var bookController = (function () {
  var itemBooks = function (id, isComplete, title, year, author, imgUrl) {
    this.id = id;
    this.isComplete = isComplete;
    this.title = title;
    this.year = year;
    this.author = author;
    this.imgUrl = imgUrl;
  };
  var data = [];
  return {
    //Set Local Storage
    localStorageBook: function () {
      var bookDataArray = localStorage.getItem('booksData')
        ? JSON.parse(localStorage.getItem('booksData'))
        : [];

      localStorage.setItem('booksData', JSON.stringify(bookDataArray));
      data = JSON.parse(localStorage.getItem('booksData'));
      return data;
    },

    addItem: function (id, isComplete, title, year, author, imgUrl) {
      var newItem = new itemBooks(id, isComplete, title, year, author, imgUrl);

      data.push(newItem);
      localStorage.setItem('booksData', JSON.stringify(data));
      return newItem;
    },
    UpdateItemData: function (id, isComplete, title, year, author, imgUrl) {
      var newItem = new itemBooks(id, isComplete, title, year, author, imgUrl);

      data = data.map((item) => {
        return item.id === id ? newItem : item;
      });
      localStorage.setItem('booksData', JSON.stringify(data));
      return newItem;
    },

    getItemByID: function (id) {
      var resData = data.find((item) => {
        return item.id === id;
      });
      return resData;
    },

    bookData: function () {
      var dataTotal = data;
      var completeRead = data.filter(function (res) {
        return res.isComplete === true;
      });

      var notCompleteRead = data.filter(function (res) {
        return res.isComplete === false;
      });

      return {
        completeRead: completeRead,
        notCompleteRead: notCompleteRead,
        dataBooks: data,
        totalBooks: dataTotal.length,
        totalcompleteRead: completeRead.length,
        totalNotCompleteRead: notCompleteRead.length,
      };
    },
    filterBook: function (keyword) {
      let filteredBooks = data.filter((book) =>
        book.title.toUpperCase().includes(keyword.toUpperCase())
      );

      return {
        filteredBooks,
      };
    },
    deleteItem: function (id, action) {
      var newItems = data.filter(function (res) {
        return res.id !== id;
      });

      data = newItems;
      localStorage.setItem('booksData', JSON.stringify(data));
      return data;
    },
  };
})();

//this function to handle UI
var UIController = (function () {
  var DOMStrings = {
    inputID: '.inputID',
    isComplete: '#isComplete',
    title: '#title',
    year: '#year',
    author: '#author',
    addButton: '.add-button',
    updateButton: '.update-button',
    cancelButton: '.cancel-button',
    booksListContainer: '.books-list-container',
    imgUrl: '.imgUrl',
    totalBooks: '.total-all-book',
    efectiveTotalBook: '.efective-total-book',
    completeRead: '.completeRead',
    notCompleteRead: '.notCompleteRead',
    deleteBtn: '.delete-item',
    updateBtn: '.update-item',
    searchInput: '.search-input',
    searchBtn: '.search-btn',
    notFoundText: '.not-found-text',
  };

  var itemBookHTML = function (book) {
    return `<div class="item-header">
    <img src="${book.imgUrl}" alt="" srcset="" />
    <div class="item-title">
      <p class="title-book">${book.title}, <span>${book.year}</span></p>
      <p class="date-books">${book.author}</p>
    </div>
  </div>
  <p class="status-book ${book.isComplete === true ? 'done' : 'undone'}">${
      book.isComplete === true ? 'Sudah Baca' : 'Belum Baca'
    }</p>
  <div class="action-books">
    <img class="update-item" src="/assets/icon-edit.svg" alt="" />
    <img class="delete-item" src="/assets/icon-delete.svg" alt="" />
  </div>`;
  };

  return {
    getInput: function () {
      return {
        id:
          document.querySelector(DOMStrings.inputID).value === ''
            ? new Date().getTime()
            : parseInt(document.querySelector(DOMStrings.inputID).value),
        isComplete:
          document.querySelector(DOMStrings.isComplete).value === 'true'
            ? true
            : false,
        title: document.querySelector(DOMStrings.title).value,
        year: document.querySelector(DOMStrings.year).value,
        author: document.querySelector(DOMStrings.author).value,
        imgUrl: document.querySelector(DOMStrings.imgUrl).value,
      };
    },
    showListBook: function (data) {
      if (data.length > 0) {
        document.querySelector(DOMStrings.booksListContainer).innerHTML = '';
        data.forEach(function (book) {
          let html = `<div class="item-books" id='${book.id}' >
          ${itemBookHTML(book)}
        </div>`;
          document
            .querySelector(DOMStrings.booksListContainer)
            .insertAdjacentHTML('beforeend', html);
        });
      }
    },
    addListItem: function (book) {
      let html = `<div class="item-books" id='${book.id}' >
      ${itemBookHTML(book)}
    </div>`;
      document
        .querySelector(DOMStrings.booksListContainer)
        .insertAdjacentHTML('beforeend', html);
    },
    updateList: function (book) {
      let updateBookHMTL = itemBookHTML(book);
      document.getElementById(book.id).innerHTML = updateBookHMTL;
    },
    clearFields: function () {
      document.querySelector(DOMStrings.cancelButton).style.display = 'none';
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMStrings.inputID +
          ', ' +
          DOMStrings.title +
          ', ' +
          DOMStrings.year +
          ', ' +
          DOMStrings.author +
          ', ' +
          DOMStrings.imgUrl +
          ',' +
          DOMStrings.searchInput
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (cur) {
        cur.value = '';
      });
      fieldsArr[2].focus();
    },
    updateTotal: function (total) {
      document.querySelector(DOMStrings.totalBooks).textContent =
        total.totalBooks + ' Buku';
      document.querySelector(DOMStrings.completeRead).textContent =
        total.totalcompleteRead + ' Buku';
      document.querySelector(DOMStrings.notCompleteRead).textContent =
        total.totalNotCompleteRead + ' Buku';
    },

    deleteList: function (id, action) {
      if (action === 'delete-item') {
        var el = document.getElementById(id);
        el.parentNode.removeChild(el);
      }
    },
    keywordSearch: function () {
      return document.querySelector(DOMStrings.searchInput).value;
    },

    updateform: function (data) {
      document.querySelector(DOMStrings.inputID).value = data.id;
      document.querySelector(DOMStrings.isComplete).value = data.isComplete;
      document.querySelector(DOMStrings.title).value = data.title;
      document.querySelector(DOMStrings.year).value = data.year;
      document.querySelector(DOMStrings.author).value = data.author;
      document.querySelector(DOMStrings.imgUrl).value = data.imgUrl;
      document.querySelector(DOMStrings.addButton).style.display = 'none';
      document.querySelector(DOMStrings.updateButton).style.display = 'block';
      document.querySelector(DOMStrings.cancelButton).style.display = 'block';
    },

    changeButton: function () {
      document.querySelector(DOMStrings.addButton).style.display = 'block';
      document.querySelector(DOMStrings.updateButton).style.display = 'none';
    },

    updateefectiveDate: function () {
      const date = new Date();
      const formattedDate = date
        .toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
        .replace(/ /g, ' ');
      document.querySelector(DOMStrings.efectiveTotalBook).innerHTML =
        formattedDate;
    },
    getDOMStrings: function () {
      return DOMStrings;
    },
  };
})();

var controller = (function (bookCtrl, UICtrl) {
  var setupEventListers = function () {
    var initalData = bookCtrl.localStorageBook();
    UICtrl.showListBook(initalData);
    UICtrl.updateTotal(bookCtrl.bookData());
    UICtrl.updateefectiveDate();

    var DOM = UICtrl.getDOMStrings();
    document
      .querySelector(DOM.addButton)
      .addEventListener('click', ctrlAddItem);
    document
      .querySelector(DOM.completeRead)
      .addEventListener('click', ctrlLoadCompleteRead);
    document
      .querySelector(DOM.notCompleteRead)
      .addEventListener('click', ctrlLoadNotCompleteRead);
    document
      .querySelector(DOM.updateButton)
      .addEventListener('click', ctrlUpdateBook);
    document
      .querySelector(DOM.booksListContainer)
      .addEventListener('click', ctrlAction);
    document
      .querySelector(DOM.searchBtn)
      .addEventListener('click', ctrlFilterBooks);
    document
      .querySelector(DOM.cancelButton)
      .addEventListener('click', ctrlCancelButton);
  };

  var ctrlLoadCompleteRead = function () {
    let dataCompleteRead = bookCtrl.bookData();
    UICtrl.showListBook(dataCompleteRead.completeRead);
  };

  var ctrlLoadNotCompleteRead = function () {
    let dataNotCompleteRead = bookCtrl.bookData();
    UICtrl.showListBook(dataNotCompleteRead.notCompleteRead);
  };

  var ctrlFilterBooks = function () {
    var keywordInput = UICtrl.keywordSearch();
    console.log(keywordInput);
    let resFilteredBooks = bookCtrl.filterBook(keywordInput).filteredBooks;

    if (resFilteredBooks.length > 0) {
      UICtrl.showListBook(resFilteredBooks);
    }
  };

  var ctrlCancelButton = function () {
    UICtrl.clearFields();
    UICtrl.changeButton();
  };

  //delete Item or update Item
  var ctrlAction = function (e) {
    var action = e.target.className;
    var itemID = e.target.parentNode.parentNode.id;
    var dataBook = bookCtrl.getItemByID(parseInt(itemID));
    if (action === 'delete-item') {
      if (window.confirm('apakah anda yakin Ingin menghapus data?')) {
        bookCtrl.deleteItem(parseInt(itemID));
        UICtrl.deleteList(itemID, action);
        UICtrl.changeButton();
        UICtrl.clearFields();
      }
    } else {
      UICtrl.updateform(dataBook);
    }

    UICtrl.updateTotal(bookCtrl.bookData());
  };
  var ctrlUpdateBook = function () {
    if (window.confirm('apakah anda yakin Ingin mengubah data?')) {
      var input = UICtrl.getInput();

      if (input.title !== '') {
        //add into database
        var updateItem = bookCtrl.UpdateItemData(
          input.id,
          input.isComplete,
          input.title,
          input.year,
          input.author,
          input.imgUrl === '' ? './assets/icon-book-list.svg' : input.imgUrl
        );

        UICtrl.updateList(updateItem);
        //show html
        UICtrl.changeButton();

        UICtrl.showListBook(bookCtrl.bookData().dataBooks);
        UICtrl.updateTotal(bookCtrl.bookData());

        //clear fields
        UICtrl.clearFields();
      }
    }
  };

  var ctrlAddItem = function () {
    var input = UICtrl.getInput();

    if (input.title !== '') {
      //add into database
      var newItem = bookCtrl.addItem(
        input.id,
        input.isComplete,
        input.title,
        input.year,
        input.author,
        input.imgUrl === '' ? './assets/icon-book-list.svg' : input.imgUrl
      );
      //show html
      UICtrl.addListItem(newItem);

      UICtrl.updateTotal(bookCtrl.bookData());

      //clear fields
      UICtrl.clearFields();
    }
  };

  return {
    init: function () {
      console.log('Application has started');
      setupEventListers();
    },
  };
})(bookController, UIController);

controller.init();
