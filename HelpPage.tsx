import React, { useState } from 'react';
import { SearchIcon, TicketIcon, UserCircleIcon, BusIcon, QuestionMarkCircleIcon, ChevronRightIcon } from './components/icons';

const faqData = [
    {
        category: 'Booking',
        question: 'Nakata itike nte?',
        answer: 'Ushobora gukata itike ukoresheje ifishi y\'ishakisha ku rupapuro rw\'itangiriro. Hitamo aho uva n\'aho ujya, hitamo itariki, maze ukande "Shakisha Bisi". Uzayoborwa mu guhitamo no kwishyura.',
    },
    {
        category: 'Booking',
        question: 'Nshobora guhagarika itike nakase?',
        answer: 'Yego, amabwiriza yo guhagarika itike aratandukanye bitewe n\'ikigo cya bisi. Turakwinginze ngo urebe amabwiriza yo guhagarika itike yawe mu gice cya "Amatike Yanjye" umaze kwinjira.',
    },
    {
        category: 'Account',
        question: 'Nabona nte itike yanjye ya elegitoronike?',
        answer: 'Itike yawe ya elegitoronike yoherezwa kuri imeri yawe wandikishije ako kanya nyuma yo kwishyura neza. Ushobora no kuyibona mu gice cya "Amatike Yanjye" ku rubuga rwacu.',
    },
     {
        category: 'On The Bus',
        question: 'Imizigo yemewe ingana ite?',
        answer: 'Ikigo cya bisi cyose kigira amabwiriza yacyo ku mizigo. Mubisanzwe, umugenzi yemerewe igikapu kimwe kinini n\'agakapu kamwe gato. Turagusaba kubaza ikigo ukoresha mbere y\'urugendo.',
    },
];

const FAQItem: React.FC<{ faq: typeof faqData[0]; isOpen: boolean; onClick: () => void }> = ({ faq, isOpen, onClick }) => (
    <div className="border-b dark:border-gray-700">
        <h2>
            <button type="button" onClick={onClick} className="flex justify-between items-center w-full p-5 font-medium text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <span>{faq.question}</span>
                <ChevronRightIcon className={`w-6 h-6 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
            </button>
        </h2>
        <div className={`p-5 border-t-0 border-gray-200 dark:border-gray-700 ${isOpen ? 'block' : 'hidden'}`}>
            <p className="text-gray-500 dark:text-gray-400">{faq.answer}</p>
        </div>
    </div>
);


const HelpPage: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const handleFaqClick = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const categories = [
        { name: 'Gukata Amatike', icon: TicketIcon },
        { name: 'Konti Yanjye', icon: UserCircleIcon },
        { name: 'Muri Bisi', icon: BusIcon },
        { name: 'Ibindi Bibazo', icon: QuestionMarkCircleIcon },
    ];

  return (
    <div className="py-16 sm:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Ikaze mu Kigo cy'Ubufasha</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Dufite ibisubizo by'ibibazo byawe.</p>
        </div>
        
        <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="search" placeholder="Shakisha ikibazo cyawe..." className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500" />
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            {categories.map(category => (
                <div key={category.name} className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                    <category.icon className="w-10 h-10 text-blue-500 mb-3" />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{category.name}</h3>
                </div>
            ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">Ibibazo Bikunze Kubazwa</h2>
          <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-md border dark:border-gray-700">
            {faqData.map((faq, index) => (
                <FAQItem 
                    key={index} 
                    faq={faq} 
                    isOpen={openFaq === index} 
                    onClick={() => handleFaqClick(index)}
                />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;