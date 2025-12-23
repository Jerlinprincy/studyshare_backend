// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   const header = req.headers.authorization;
//   if (!header) return res.status(401).json({ message: "No token provided" });

//   const token = header.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;  
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// export default authMiddleware;










import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1]; // extract token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id }; // ensure structure is correct

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
