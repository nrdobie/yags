interface JeopardyCategoryProps {
  category: string;
}

function JeopardyCategory(props: JeopardyCategoryProps) {
  return (
    <div className="aspect-video @container/category text-white bg-[hsl(239,85%,27%)] grid place-content-center overflow-hidden">
      <p className="@xs/category:text-[15cqi] @xs/category:drop-shadow-[0.05em_0.05em_0_black] text-center font-['Swiss_911_Condensed'] leading-tight uppercase tracking-wider p-[2cqi]">
        {props.category}
      </p>
    </div>
  );
}

export { JeopardyCategory };
