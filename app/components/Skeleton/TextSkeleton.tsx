import style from "./Skeleton.module.scss";

const TextSkeleton = () => {
  return (
    <div className={style.sK}>
      <div className={style.block}></div>
    </div>
  );
};

export default TextSkeleton;
