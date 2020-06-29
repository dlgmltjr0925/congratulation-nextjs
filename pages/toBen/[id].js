import { useRouter } from 'next/router';

const CARD_LIST = [];

const Message = () => {
  const router = useRouter();

  const { id } = router.query;

  return (
    <>
      <div></div>
      <style jsx>{``}</style>
    </>
  );
};

export default Message;
