// This is a JavaScript file

const API_KEY = "please set api key."; // TODO omdbapi のAPI KEYを指定してください！

$(document).ready(function () {
    // Viewのイベントフック.
    $('#serachButton').on('click', function () {
        let searchText = $('#searchText').val();
        getMovies(searchText);
    });
});

// movie.htmlが表示する前のイベントをフックする。
$(document).on('pagebeforeshow', '#movie', function () {
    let movieId = sessionStorage.getItem('movieId');
    getMovieDetail(movieId);
});

// APIコールしてMovie一覧情報を取得する.
// ex: https://www.omdbapi.com/?apikey=[API KEY]&s=titanic
function getMovies(searchText) {
    $.ajax({
        url: 'http://www.omdbapi.com/?apikey=' + API_KEY + '&s=' + searchText,
        type: 'GET'
    }).done((data) => { // jsonデータがObjectに変換された形で渡ってくる.
        $('movies').empty();
        // 成功時
        let movies = data.Search;
        let output = '';
        $.each(movies, function (index, movie) {
            output += `
                <li>
                    <a onclick="movieClicked('${movie.imdbID}')" href="#">
                        <img src="${movie.Poster}">
                        <h2>${movie.Title}</h2>
                        <p>Release Year: ${movie.Year}</p>
                    </a>
                </li>
                `;
        });
        // 動的にリストアイテムを追加した場合は、refreshを呼ぶ.
        $('#movies').html(output).listview('refresh');
    }).fail((data) => {
        // 失敗時
        alert('通信失敗');
    }).always((data) => {
        // 必ず呼ばれる
    });
}

function movieClicked(id) {
    console.log(id);
    sessionStorage.setItem('movieId', id);
    $.mobile.changePage('movie.html');
}

function getMovieDetail(movieId) {
    $.ajax({
        url: 'http://www.omdbapi.com/?apikey=' + API_KEY + '&i=' + movieId,
        type: 'GET'
    }).done((movie) => {
        // 成功時
        let movieTop = `
            <div style="text-align:center">
                <h1>${movie.Title}</h1>
                <img src="${movie.Poster}">
            </div>    
            `;
        $('#movieTop').html(movieTop);

        let movieDetails = `
            <li>Genre: ${movie.Genre}</li>
            <li>Rated: ${movie.Rated}</li>
            <li>Released: ${movie.Released}</li>
            <li>Runtime: ${movie.Runtime}</li>
            <li>imdbRating: ${movie.imdbRating}</li>
            <li>imdbVotes: ${movie.imdbVotes}</li>
            <li>Actors: ${movie.Actors}</li>
            <li>Director: ${movie.Director}</li>
            `;
        // 動的にリストアイテムを追加した場合は、refreshを呼ぶ.
        $('#movieDetails').html(movieDetails).listview('refresh');
    }).fail((data) => {
        // 失敗時
        alert('通信失敗');
    }).always((data) => {
        // 必ず呼ばれる
    });
}