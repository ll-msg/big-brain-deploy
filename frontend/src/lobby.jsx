import { useEffect, useState } from 'react';

function Lobby() {
    const [showJoke, setShowJoke] = useState(false);
    const [choice, setChoice] = useState(false);
    const [joke, setJoke] = useState('');
    const [likePoem, setLikePoem] = useState(null);
    const [poem, setPoem] = useState([]);
    const introLines = [
        "I know, I know, It's boring right now...That guy still not starting this game",
        "I told her or him or whatever like 1000 times we should at least try to start this soon or people will complain!",
        "But as long as we are here",
        "Do you want to hang out with me to have some fun?"
    ];
    const [curLine, setcurLine] = useState(0);
    const [showButton, setShowButton] = useState(false);

    // show one introductions line per 2 seconds
    useEffect(() => {
        if (!choice && curLine < introLines.length) {
            const timer = setTimeout(() => {
                setcurLine((prev) => (prev + 1));
            }, 2000);
            return () => clearTimeout(timer);
        }

        if (curLine === introLines.length && !showButton) {
            const timer = setTimeout(() => {
                setShowButton(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [choice, curLine]);
    
    // allow user to choose button
    const handleClickFun = () => {
        setChoice(true);
    }

    // allow user to choose poetry button
    const handleClickPoem = () => {
        setLikePoem(true);
    }

    // allow user to choose not like poetry button
    const handleClickPoemFalse = () => {
        setLikePoem(false);
    }

    // fetch a random programming joke
    const fetchJoke = () => {
        setShowJoke(true);
        fetch("https://sv443.net/jokeapi/v2/joke/Programming?type=single")
            .then((res) => res.json())
            .then((data) => setJoke(data.joke));
    };

    // fetch a random poem
    const fetchPoem = () => {
        fetch("https://poetrydb.org/random")
            .then((res) => res.json())
            .then((data) => setPoem(data[0].lines));
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-start px-4 py-10">
            {!choice ? (
                <div className="text-center space-y-4 text-lg max-w-2xl">
                    {introLines.slice(0, curLine).map((l, i) => (
                        <p key={i} className="transition-all duration-500 opacity-100">{l}</p>
                    ))}
                    {showButton && (
                        <div className="flex justify-center gap-6 mt-6">
                            <button onClick={handleClickFun} className="px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition">Yes</button>
                            <button onClick={handleClickFun} className="px-5 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition">Okay?</button>
                        </div>
                    )}
                </div>
             
            ): (
                <div className="text-center space-y-4 max-w-xl">
                    <p className="text-green-400">Wow you actually click that button?</p>
                    <p className="text-green-400">Thank you for the trust!</p>
                    <p className="text-gray-400 italic">Here are questions for you! :3</p>
                
                    <div className="flex flex-col items-center gap-4 mt-6">
                        <p>Do you enjoy poetry?</p>
                        <div className="flex gap-4">
                            <button onClick={handleClickPoem} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded text-white transition">Yes</button>
                            <button onClick={handleClickPoemFalse} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded text-white transition">No</button>
                        </div>
                    </div>

                    {likePoem === true && (
                        <div className="mt-6 space-y-3">
                            <p>
                            Really?! Here is a{' '}
                            <a onClick={fetchPoem} className="underline text-pink-400 hover:text-pink-600 transition cursor-pointer">gift</a>!
                            </p>
                            {poem.length > 0 && (
                            <div className="mt-4 space-y-1 text-center text-gray-200 italic">
                                {poem.map((l, i) => (
                                <p key={i}>{l}</p>
                                ))}
                            </div>
                            )}
                        </div>
                    )}

                    {likePoem === false && (
                    <div className="mt-6 space-y-3">
                        <p>It's OK! I have got something else for you.</p>
                        <p>
                        Wanna see <a onClick={fetchJoke} className="underline text-blue-400 hover:text-blue-600 transition cursor-pointer">something</a> funny?
                        </p>
                        {showJoke && (
                        <p className="text-yellow-300 font-mono">{joke}</p>
                        )}
                    </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Lobby;