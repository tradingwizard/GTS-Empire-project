import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import './free-bots.scss';

interface Bot {
    id: string;
    name: string;
    description: string;
    fileName: string;
    category: string;
    icon: string;
}

// Keep this list empty until GTS Empire's approved bots are supplied.
// Add future bot XML files to /public/bots and register them here.
const BOTS: Bot[] = [];

const FreeBots = observer(() => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', ...Array.from(new Set(BOTS.map(bot => bot.category)))];
    const filteredBots = selectedCategory === 'All' ? BOTS : BOTS.filter(bot => bot.category === selectedCategory);
    const hasBots = filteredBots.length > 0;

    return (
        <div className='free-bots'>
            <div className='free-bots__header'>
                <h1 className='free-bots__title'>GTS Empire Free Tools</h1>
                <p className='free-bots__subtitle'>
                    GTS Empire automation tools will appear here once approved bots are added. The page structure is ready,
                    but no saved bots are currently published.
                </p>
            </div>

            <div className='free-bots__categories'>
                {categories.map(category => (
                    <button
                        key={category}
                        className={`free-bots__category-btn ${selectedCategory === category ? 'free-bots__category-btn--active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {hasBots ? (
                <div className='free-bots__grid'>
                    {filteredBots.map(bot => (
                        <div key={bot.id} className='free-bots__card'>
                            <div className='free-bots__card-header'>
                                <span className='free-bots__card-icon'>{bot.icon}</span>
                                <span className='free-bots__card-category'>{bot.category}</span>
                            </div>
                            <h3 className='free-bots__card-title'>{bot.name}</h3>
                            <p className='free-bots__card-description'>{bot.description}</p>
                            <button className='free-bots__card-btn' disabled>
                                <span>Coming Soon</span>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='free-bots__empty-state'>
                    <div className='free-bots__empty-icon'>🤖</div>
                    <h3>No bots published yet</h3>
                    <p>
                        The saved bot list has been cleared. Add your approved GTS Empire bot XML files later and they will
                        be connected to this same page.
                    </p>
                </div>
            )}

            <div className='free-bots__footer'>
                <p>All bots added later should be tested on demo accounts first. Trading involves risk.</p>
            </div>
        </div>
    );
});

export default FreeBots;
