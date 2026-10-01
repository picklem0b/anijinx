import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './anime.css'
import { Layout } from '@/components/anime/Layout'
import { MarketingLayout } from '@/components/marketing/MarketingLayout'
import BrowsePage from '@/pages/BrowsePage'
import DetailPage from '@/pages/DetailPage'
import DiscoverPage from '@/pages/DiscoverPage'
import HomePage from '@/pages/HomePage'
import LibraryPage from '@/pages/LibraryPage'
import ProfilePage from '@/pages/ProfilePage'
import ReelsPage from '@/pages/ReelsPage'
import WatchPage from '@/pages/WatchPage'
import AboutPage from '@/pages/marketing/AboutPage'
import ContactPage from '@/pages/marketing/ContactPage'
import HelpPage from '@/pages/marketing/HelpPage'
import LandingPage from '@/pages/marketing/LandingPage'
import LegalPage from '@/pages/marketing/LegalPage'
import NotFoundPage from '@/pages/marketing/NotFoundPage'
import PricingPage from '@/pages/marketing/PricingPage'
import SignInPage from '@/pages/marketing/SignInPage'
import SignUpPage from '@/pages/marketing/SignUpPage'
import SettingsPage from '@/settings/Page'

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<MarketingLayout />}>
					<Route path='/landing' element={<LandingPage />} />
					<Route path='/about' element={<AboutPage />} />
					<Route path='/pricing' element={<PricingPage />} />
					<Route path='/help' element={<HelpPage />} />
					<Route path='/contact' element={<ContactPage />} />
					<Route path='/legal' element={<LegalPage />} />
					<Route path='/sign-in' element={<SignInPage />} />
					<Route path='/sign-up' element={<SignUpPage />} />
				</Route>

				<Route path='/settings' element={<SettingsPage />} />
				<Route element={<Layout />}>
					<Route index element={<HomePage />} />
					<Route path='discover' element={<DiscoverPage />} />
					<Route path='browse' element={<BrowsePage />} />
					<Route path='anime/:id' element={<DetailPage />} />
					<Route path='watch/:id/:ep' element={<WatchPage />} />
					<Route path='reels' element={<ReelsPage />} />
					<Route path='library' element={<LibraryPage />} />
					<Route path='profile' element={<ProfilePage />} />
				</Route>

				<Route path='*' element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	)
}
