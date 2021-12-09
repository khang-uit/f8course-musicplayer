const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
    currentIndex: 0,    
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: "Evergreen",
            singer: "Westlife",
            path: "./assets/music/Westlife_-_Evergreen_Qoret.com.mp3",
            image: "./assets/img/Evergreen.jpg"
        },
        {   name: "Flying Without Wings",
            singer: "Westlife",
            path: "./assets/music/Westlife_-_Flying_Without_Wings_Qoret.com.mp3",
            image: "./assets/img/Flying_Without_Wings.jpg"
        },
        {   name: "Fool Again",
            singer: "Westlife",
            path: "./assets/music/Westlife_-_Fool_Again_Qoret.com.mp3",
            image: "./assets/img/Fool_Again.jpg"
        },
        {   name: "Seasons In The Sun",
            singer: "Westlife",
            path: "./assets/music/Westlife_-_Seasons_In_The_Sun_Qoret.com.mp3",
            image: "./assets/img/Seasons_In_The_Sun.jpg"
        },
        {   name: "Soledad",
            singer: "Westlife",
            path: "./assets/music/Westlife_-_Soledad_Qoret.com.mp3",
            image: "./assets/img/Soledad.jpg"
        },
        {   name: "Somebody Needs You",
            singer: "Westlife",
            path: "./assets/music/Westlife_-_Somebody_Needs_You_Qoret.com.mp3",
            image: "./assets/img/Somebody_Needs_You.jpg"
        },
        {   name: "Swear It Again",
            singer: "Westlife",
            path: "./assets/music/Westlife_-_Swear_It_Again_Qoret.com.mp3",
            image: "./assets/img/Swear_It_Again.jpg"
        }
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    loadConfig () {
        this.isRandom = this.config.isRandom || this.isRandom;
        this.isRepeat = this.config.isRepeat || this.isRepeat;
        this.currentIndex = this.config.currentIndex || this.currentIndex;
        // Hiển thị trạng thái ban đầu của buttom random và repeat
        repeatBtn.classList.toggle('active',this.isRepeat);
        randomBtn.classList.toggle('active',this.isRandom);
    },

    // Render
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },

    // Dinh nghia prop mac dinh
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex]
            }
        });
    },

    // Handle Events
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xu li CD rotate
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10 seconds
            iterations:Infinity,
        })

        cdThumbAnimate.pause()

        // Xu li phong to thu nho CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
      
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Xu li khi click toggle
        playBtn.onclick = function () {
            if(_this.isPlaying) {
                audio.pause()
            }else {
                audio.play()
            }

            // Khi bai hat duoc play
            audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }

            // Khi bai hat duoc pause
            audio.onpause = function() {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }

            // Khi tien do bai hat thay doi
            audio.ontimeupdate = function() {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent; 

                }
            }
        }


        //  Xu li khi tua
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime            
        }

        //Khi next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
        }

        // Khi prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        
        //
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig("isRandom",_this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig("isRepeat",_this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xu li next song khi audio end
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                if (e.target.closest('.option')) {

                }

            }
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest"
            })
        }, 300)
    },

    loadCurrentSong: function() {       
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        
        this.setConfig("currentIndex", this.currentIndex)
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        console.log(newIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    // Start the page
    start: function() {
        // Gan cau hinh tu config vao ung dung
        this.loadConfig()
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
        
        audio.volume = 0.1
    }


}

app.start()


