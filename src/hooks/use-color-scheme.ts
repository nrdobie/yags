import { useCallback, useMemo } from "react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";
const LOCAL_STORAGE_KEY = "color-scheme";

enum ColorScheme {
	Dark = "dark",
	Light = "light",
	System = "system",
}

interface UseColorShemeOptions {
	defaultColorScheme?: ColorScheme;
	localStorageKey?: string;
	initializeWithValue?: boolean;
}

function useColorScheme(options: UseColorShemeOptions = {}) {
	const {
		defaultColorScheme = ColorScheme.System,
		localStorageKey = LOCAL_STORAGE_KEY,
		initializeWithValue = true,
	} = options;

	const isPreferDarkQuery = useMediaQuery(COLOR_SCHEME_QUERY);

	const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>(
		localStorageKey,
		defaultColorScheme,
		{ initializeWithValue },
	);

	const isDarkMode = useMemo(() => {
		if (colorScheme === ColorScheme.System) {
			return isPreferDarkQuery;
		}

		return colorScheme === ColorScheme.Dark;
	}, [colorScheme, isPreferDarkQuery]);

	const toggle = useCallback(() => {
		switch (colorScheme) {
			case ColorScheme.Dark:
				setColorScheme(ColorScheme.Light);
				break;
			case ColorScheme.Light:
				setColorScheme(ColorScheme.Dark);
				break;
			case ColorScheme.System:
				setColorScheme(isDarkMode ? ColorScheme.Dark : ColorScheme.Light);
				break;
		}
	}, [colorScheme, isDarkMode, setColorScheme]);

	const lightMode = useMemo(
		() => colorScheme === ColorScheme.Light,
		[colorScheme],
	);
	const darkMode = useMemo(
		() => colorScheme === ColorScheme.Dark,
		[colorScheme],
	);
	const systemMode = useMemo(
		() => colorScheme === ColorScheme.System,
		[colorScheme],
	);

	return {
		colorScheme,
		isDarkMode,
		toggle,
		lightMode,
		darkMode,
		systemMode,
		setColorScheme,
	};
}

export { ColorScheme, useColorScheme };
