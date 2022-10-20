const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('.header h2');
const cdBack = $('.cd-back');
const audio = $('#audio');
const inputRange = $('#progress');
const playlist = $('.playlist');

const app = {
    currentSongIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem('STROGE')) || {},
    
    songs : [
        {
            name: 'Tâm sự với Ngài',
            singer: 'Trang Myn',
            path: './music/song0.mp3',
            image: './img/song0.jpg'
        },
        {
            name: 'Mất anh em có buồn',
            singer: 'The men',
            path: './music/song1.mp3',
            image: './img/song1.jfif'
        },
        {
            name: 'sau lưng anh có ai kìa',
            singer: 'Thiều Bảo Trâm',
            path: './music/song2.mp3',
            image: './img/song2.jfif'
        },
        {
            name: 'Răng khôn',
            singer: 'Phí Phương Anh',
            path: './music/song3.mp3',
            image: './img/song3.jfif'
        },
        {
            name: 'Người ta đâu thương em',
            singer: 'LYLY',
            path: './music/song4.mp3',
            image: './img/song4.jpg'
        },
        {
            name: 'Sợ rằng em biết anh còn yêu em',
            singer: 'JUUN D',
            path: './music/song5.mp3',
            image: './img/song5.jfif'
        },
        {
            name: 'Tâm sự với người lạ',
            singer: 'Tiên Cokie',
            path: './music/song6.mp3',
            image: './img/song6.jfif'
        },
        {
            name: 'Vâng chính em',
            singer: 'Trang Myn',
            path: './music/song7.mp3',
            image: './img/song0.jpg'
        },
        {
            name: 'Về nhà đi con',
            singer: 'Trang Myn',
            path: './music/song8.mp3',
            image: './img/song0.jpg'
        },
    
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem('STROGE', JSON.stringify(this.config));
    },

    render: function() {
        const html = this.songs.map((song, index) => {
            return `
            <div class="song ${index == this.currentSongIndex ? 'active' : ''}" data-index="${index}">
                <div class="item-img">
                    <div class="item-img-back" style="background-image: url(${song.image});"></div>
                </div>
                <div class="item-info">
                    <h3 class="item-name">${song.name}</h3>
                    <p class="item-singer">${song.singer}</p>
                </div>
                <div class="item-muti">
                    <i class="fa-solid fa-list-ul"></i>
                </div>
            </div>       
            `;
        });
        document.querySelector('.playlist').innerHTML = html.join('');
    },

    handleEvent: function() {
        const _this = this;


        // scroll app
        const cdWidth = $('.cd').offsetWidth;
        document.onscroll = function() {
            if (document.scrollingElement) {
                const scrollY = document.scrollingElement.scrollTop || window.scrollY;
                const newCdWidth = cdWidth - scrollY;
                $('.cd').style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                $('.cd').style.opacity = newCdWidth / cdWidth;
            }
        };

        // xu ly dia CD quay
        const cdBackAnimate = cdBack.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity,
        });
        cdBackAnimate.pause()


        // play/pause audio events
        const btnPlay = document.querySelector('.btn.btn-toggle-play');
        btnPlay.onclick = function() {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // handle audio play
        audio.onplay = function() {
            btnPlay.classList.add('playing');
            app.isPlaying = true;
            cdBackAnimate.play();
        };

        // handle audio pause
        audio.onpause = function() {
            btnPlay.classList.remove('playing');
            app.isPlaying = false;
            cdBackAnimate.pause();

        };



        // khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                inputRange.value = Math.floor(audio.currentTime / audio.duration * 100);
            } else {
                inputRange.value = 0;
            }

        };

        
        // khi tua bai hat
        inputRange.onpointerdown = function() {
            audio.pause();
        };

        inputRange.onpointerup = function() {
            audio.currentTime = Math.floor(inputRange.value / 100 * audio.duration);
            audio.play();
        };


        // next song
        nextSong = function() {
            if (!_this.isRandom) {
                _this.currentSongIndex++;
                if (_this.currentSongIndex >= _this.songs.length) {
                    _this.currentSongIndex = 0;
                };
                _this.loadCurrentSong();
                audio.play()
            } else {
                randomSong();
                _this.loadCurrentSong();
                audio.play()
            };
            _this.render();
            scrollToView();
        };

        // prev song
        prevSong = function() {
            if (!_this.isRandom) {
                _this.currentSongIndex--;
                if (_this.currentSongIndex < 0) {
                    _this.currentSongIndex = _this.songs.length - 1;
                };
                _this.loadCurrentSong();
                audio.play()
            } else {
                randomSong();
                _this.loadCurrentSong();
                audio.play()
            };
            _this.render();
            scrollToView();    
        };

        // randomsong
        $('.btn-random').onclick = function() {
            _this.isRandom = !_this.isRandom;
            $('.btn-random i').classList.toggle('active', _this.isRandom);
            _this.setConfig('isRandom', _this.isRandom);
        };

        randomSong = function() {
            let newSongIndex;
            do {
                newSongIndex = Math.floor(Math.random() * _this.songs.length);
            } while (newSongIndex == _this.currentSongIndex);
            _this.currentSongIndex = newSongIndex;
        };

        // xu ly repeat
        $('.btn-repeat').onclick = function() {
            _this.isRepeat =!_this.isRepeat;
            $('.btn-repeat i').classList.toggle('active', _this.isRepeat);
            _this.setConfig('isRepeat', _this.isRepeat);
        };

        // xu ly next khi end song
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                if (!_this.isRandom) {
                    _this.currentSongIndex++;
                    if (_this.currentSongIndex >= _this.songs.length) {
                        _this.currentSongIndex = 0;
                    };
                    _this.loadCurrentSong();
                    audio.play()
                } else {
                    randomSong();
                    _this.loadCurrentSong();
                    audio.play()
                }
            };
            _this.render();
            scrollToView();
        };

        // day song len tam view
        scrollToView = function() {
            let indexSongLast = _this.songs.length - 1;
            if (_this.currentSongIndex === 0 || _this.currentSongIndex === indexSongLast ) {
                setTimeout( function() {
                    $('.song.active').scrollIntoView({
                        behavior:'smooth',
                        block:'center',
                    })
                }, 200)
            } else {
                setTimeout( function() {
                    $('.song.active').scrollIntoView({
                        behavior:'smooth',
                        block:'nearest',
                    })
                }, 200)
            }
        };

        // lang nghe hanh vi click vao playlist
        playlist.onclick    = function(e)  {
            const songNode = e.target.closest('.song:not(.active');
            if (songNode || e.target.closest('.item-muti')) {
                if (songNode) {
                    _this.currentSongIndex = songNode.dataset.index;
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        };

        
    },
    
    // loadconfig
    loadConfig() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentSongIndex];
            }
        })
    },

    loadCurrentSong() {
        heading.innerText = this.currentSong.name;
        cdBack.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    
    start: function () {

        
        this.defineProperties();
        
        
        this.loadCurrentSong();
        
        this.render();
        
        this.handleEvent();
        
        this.loadConfig();
        $('.btn-random i').classList.toggle('active', this.isRandom);
        $('.btn-repeat i').classList.toggle('active', this.isRepeat);
    }
};

app.start();






