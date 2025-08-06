import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Link as ScrollLink } from 'react-scroll'
import classNames from '@/utils/classNames'
import { HiOutlineChevronDown, HiOutlineChevronRight } from 'react-icons/hi'

const NavItem = ({ tab, onTabClick, isActive, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef(null);
    const isAnchor = (url) => url && url.startsWith('#')
    const hasChildren = tab.children && tab.children.length > 0;

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (hasChildren) {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const ChevronIcon = level === 0 ? HiOutlineChevronDown : HiOutlineChevronRight;

    return (
        <li
            className={classNames(
                "relative",
                'w-full',
                'group'
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className={classNames(
                    "relative px-5 py-2 rounded-xl flex items-center justify-between gap-1 cursor-pointer",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    level > 0 ? 'py-2' : '',
                    'min-w-max' // Tambahkan min-w-max agar menu menyesuaikan konten
                )}
            >
                {level === 0 && isActive && (
                    <motion.div
                        layoutId="clickedbutton"
                        transition={{
                            type: 'spring',
                            bounce: 0.3,
                            duration: 0.6,
                        }}
                        className="absolute inset-0 rounded-xl bg-gray-100 dark:bg-gray-700"
                    />
                )}
                
                {isAnchor(tab.url) ? (
                    <ScrollLink
                        smooth
                        to={tab.url.substring(1)}
                        className="relative block heading-text z-10"
                        duration={500}
                        onClick={onTabClick}
                    >
                        {tab.title}
                    </ScrollLink>
                ) : (
                    <RouterLink
                        to={tab.url}
                        className="relative block heading-text z-10"
                        onClick={onTabClick}
                    >
                        {tab.title}
                    </RouterLink>
                )}
                
                {hasChildren && (
                    <ChevronIcon className={classNames(
                        "ml-2 transition-transform duration-200",
                        level === 0 && isOpen ? 'rotate-180' : ''
                    )} />
                )}
            </div>
            
            {hasChildren && isOpen && (
                <ul className={classNames(
                    "absolute z-50 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-2",
                    "min-w-[180px]",
                    level === 0 ? "top-full left-0 mt-2" : "-top-2 left-full ml-4"
                )}>
                    <NavList tabs={tab.children} level={level + 1} onTabClick={onTabClick} />
                </ul>
            )}
        </li>
    );
};

const NavList = ({ tabs: propTabs, onTabClick, level = 0 }) => {
    const location = useLocation()
    const [active, setActive] = useState(null)
    
    useEffect(() => {
        const findActiveTab = (items) => {
            for (const item of items) {
                if (item.url === location.pathname) {
                    return item;
                }
                if (item.children && item.children.length > 0) {
                    const childActive = findActiveTab(item.children);
                    if (childActive) return childActive;
                }
            }
            return null;
        };

        const activeTab = findActiveTab(propTabs);
        if (activeTab) {
            setActive(activeTab);
        }
    }, [propTabs, location.pathname]);

    const handleTabClick = (tab) => {
        setActive(tab);
        onTabClick?.();
    };

    return (
        <ul className={classNames(
            "flex",
            level === 0 ? "flex-row items-center gap-2" : "flex-col" 
        )}>
            {propTabs.map((tab) => (
                <NavItem
                    key={tab.id}
                    tab={tab}
                    isActive={active && active.id === tab.id}
                    level={level}
                    onTabClick={() => handleTabClick(tab)}
                />
            ))}
        </ul>
    );
};

export default NavList;