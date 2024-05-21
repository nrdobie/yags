import { useMemo } from "react";
import { useColorScheme, ColorScheme } from "~/hooks/use-color-scheme";
import { faSun, faMoon, faDesktop } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SelectColorTheme() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const icon = useMemo(() => {
    switch (colorScheme) {
      case ColorScheme.Light:
        return faSun;
      case ColorScheme.Dark:
        return faMoon;
      default:
        return faDesktop;
    }
  }, [colorScheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button $variant="ghost" $size="icon">
          <FontAwesomeIcon icon={icon} fixedWidth />
          <span className="sr-only">Color Scheme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={colorScheme}
          onValueChange={(value) =>
            setColorScheme(value as unknown as ColorScheme)
          }
        >
          <DropdownMenuRadioItem value={ColorScheme.System}>
            System
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={ColorScheme.Light}>
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={ColorScheme.Dark}>
            Dark
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { SelectColorTheme };
