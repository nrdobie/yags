interface JeopardyClueProps {
  clue: string;
}

function JeopardyClue(props: JeopardyClueProps) {
  return (
    <div className="aspect-video @container/clue text-white bg-[hsl(239,85%,27%)]">
      <div className="aspect-[4/3] h-full mx-auto p-4 grid place-content-center overflow-hidden">
        <p className="@xs/clue:text-[5cqi] @xs/clue:drop-shadow-[0.05em_0.05em_0_black] font-['ITC_Korinna']  text-center text-pretty whitespace-break-spaces leading-tight">
          {props.clue}
        </p>
      </div>
    </div>
  );
}

export { JeopardyClue };
