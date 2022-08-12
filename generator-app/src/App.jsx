import React, {useState, createRef, useEffect} from 'react';
import './style.scss';
import { ReplyIcon, RetweetIcon, LikeIcon, ShareIcon, VerifiedIcon } from './icons';
import { AvatarLoader } from './loader';
import { useScreenshot } from 'use-react-screenshot';
import {language} from './languages';

function convertImgToBase64(url, callback, outputFormat) {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL(outputFormat || 'image/png');
      callback.call(this, dataURL);
      // Clean up
      canvas = null;
    };
    img.src = url;
}

const tweetFormat = tweet => {
    tweet = tweet
    .replace(/(@[\w]+)/g, '<span>$1</span>')
    .replace(/#([\wşçöğüi]+)/gi, '<span>#$1</span>')
    .replace(/(https?:\/\/[\w\.\/]+)/, '<span>$1</span>')
    return tweet;
}

const formatNumber = number => {
    
    if(!number){
        number = 0;
    }

    if (number < 1000) {
        return number;
    }

    number /= 1000;
    number = String(number).split('.');
    return number[0] + (number[1] < 100 ? ',' + number[1].slice(0, 1)+' B' : ' B');
}

var App = () => {
    const tweetRef = createRef(null);
    const [name, setName] = useState();
    const downloadRef = createRef();
    const [username, setUsername] = useState();
    const [isVerified, setIsVerified] = useState(0);
    const [avatar, setAvatar] = useState();
    const [tweet, setTweet] = useState('Bu tweet @efe tarafından #fakegenerator adlı başlık için yazılmıştır https://www.youtube.com');
    const [retweets, setRetweets] = useState(1423);
    const [quoteTweet, setQuoteTweet] = useState(0);
    const [likes, setLikes] = useState(0);
    const [lang, setLang] = useState('tr');
    const [langText, setLangText] = useState(language[lang]);

    const [image, takeScreenshot] = useScreenshot();
    const getImage = () => takeScreenshot(tweetRef.current);

    useEffect(() => {
        setLangText(language[lang]);
    }, [lang])

    useEffect(() => {
        if (image) {
            downloadRef.current.click();
        }
    }, [image])

    const avatarHandle = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            setAvatar(this.result);
        });
        reader.readAsDataURL(file);
    };

    const fetchTwitterInfo = () => {
        fetch(`https://typeahead-js-twitter-api-proxy.herokuapp.com/demo/search?q=${username}`)
        .then(res => res.json())
        .then(data => {
            const twitter = data[0];
            console.log(twitter);
            convertImgToBase64(twitter.profile_image_url, function(base64Image) {
                setAvatar(base64Image);
            })
            setName(twitter.name);
            setTweet(twitter.status.text);
            setRetweets(twitter.status.retweet_count);
            setLikes(twitter.status.favorite_count);
        });

    }

    return(
        <div className="main">
            <div className="tweet-settings">
                <h3>{langText?.settings}</h3>
                <ul>
                    <li>
                        <label htmlFor="">{langText?.name}</label>
                        <input className="input" type="text" value={name} 
                        onChange={e => setName(e.target.value)}
                        />
                    </li>
                    <li>
                        <label htmlFor="">{langText?.username}</label>
                        <input className="input" type="text" value={username} 
                        onChange={e => setUsername(e.target.value)} />
                    </li>
                    <li>
                        <label htmlFor="">Tweet</label>
                        <textarea rows="5" className="input" type="text" value={tweet} 
                        onChange={e => setTweet(e.target.value)} />
                    </li>
                    <li>
                        <label htmlFor="">Avatar</label>
                        <input className="input" type="file"
                        onChange={avatarHandle}
                        />
                    </li>
                    <li className="half">
                        <label htmlFor="">Retweet</label>
                        <input className="input" type="number" value={retweets} 
                        onChange={e => setRetweets(e.target.value)}
                        />
                    </li>
                    <li className="half">
                        <label htmlFor="">{langText?.quotes}</label>
                        <input className="input" type="number" value={quoteTweet} 
                        onChange={e => setQuoteTweet(e.target.value)}
                        />
                    </li>
                    <li className="half">
                        <label htmlFor="">{langText?.likes}</label>
                        <input className="input" type="number" value={likes} 
                        onChange={e => setLikes(e.target.value)}
                        />
                    </li>
                    <li>
                        <label htmlFor="">{langText?.verified}</label>
                        <select onChange={e => setIsVerified(e.target.value)} defaultValue={isVerified} name="" id="">
                            <option value="1">{langText?.yes}</option>
                            <option value="0">{langText?.no}</option>
                        </select>
                    </li>
                    <button onClick={getImage}>{langText?.create}</button>
                    <div className="download-url">
                        {image && (
                            <a ref={downloadRef} href={image} download="tweet.png">Tweeti İndir</a>
                        )}
                    </div>
                </ul>
            </div>
            <div className="tweet-container">
                <div className="lang">
                    <span 
                        className={lang === 'tr' ? 'active' : undefined}
                        onClick={() => setLang('tr')}
                    >
                        Türkçe
                    </span>
                    <span 
                        className={lang === 'en' ? 'active' : undefined}
                        onClick={() => setLang('en')}
                    >
                        English
                    </span>
                </div>
                <div className="sticky-area">
                    <div className="fetch-info">
                        {/* <label htmlFor=""></label> */}
                        <div className="bottom">
                            <input type="text" placeholder={username || langText?.enterUsername } onChange={e => setUsername(e.target.value)} />
                            <button onClick={fetchTwitterInfo}>{langText?.fetchInfo}</button>
                        </div>
                    </div>
                    <div className="tweet" ref={tweetRef}>
                        <div className="tweet-author">
                            {avatar && <img src={avatar} alt="" /> || <AvatarLoader/>}
                            <div>
                                <div className="name">
                                    {name || 'Ad Soyad'}
                                    {isVerified == 1 && <VerifiedIcon color="#fff" width="19" height="19" />}
                                </div>
                                <div className="user-name">@{username || 'kullaniciadi'}</div>
                            </div>
                        </div>
                        <div className="tweet-content">
                            <p 
                            dangerouslySetInnerHTML={{__html: (tweet && tweetFormat(tweet))|| 'Buraya tweet yazısı gelecek..'}}>
                            </p>
                        </div>
                        <div className="tweet-stats">
                            <span>
                                <b>{formatNumber(retweets)}</b> Retweet
                            </span>
                            <span>
                                <b>{formatNumber(quoteTweet)}</b> {langText?.quoteTweets}
                            </span>
                            <span>
                                <b>{formatNumber(likes)}</b> {langText?.likes}
                            </span>
                        </div>
                        <div className="tweet-actions">
                            <span><ReplyIcon color="#6e767d" width="24" height="24" /></span>
                            <span><RetweetIcon color="#6e767d" width="24" height="24" /></span>
                            <span><LikeIcon color="#6e767d" width="24" height="24" /></span>
                            <span><ShareIcon color="#6e767d" width="24" height="24" /></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;