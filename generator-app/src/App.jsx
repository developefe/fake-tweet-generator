import React, {useState} from 'react';
import './style.scss';
import { ReplyIcon, RetweetIcon, LikeIcon, ShareIcon, VerifiedIcon } from './icons';

var App = () => {
    const [name, setName] = useState();
    const [username, setUsername] = useState();

    return(
        <div className="main">
            <div className="tweet-settings">
                <h3>Tweet Ayarları</h3>
            </div>
            <div className="tweet-container">
                <div className="tweet">
                    <div className="tweet-author">
                        <img src="https://pbs.twimg.com/profile_images/1339535963974938624/gJLu8mSl_200x200.jpg" alt="" />
                        <div>
                            <div className="name">
                                Efe Işık
                                <VerifiedIcon color="#fff" width="19" height="19"></VerifiedIcon>
                            </div>
                            <div className="user-name">@efesk</div>
                        </div>
                    </div>
                    <div className="tweet-content">
                        <p>
                            Bu fake-tweet-generator tarafından oluşturulmuş fake bir tweettir. Lütfen aldırış etmeyiniz.
                        </p>
                    </div>
                    <div className="tweet-stats">
                        <span>
                            <b>24</b> Retweet
                        </span>
                        <span>
                            <b>24</b> Alıntı Tweetler
                        </span>
                        <span>
                            <b>24</b> Beğeni
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
    )
}

export default App;