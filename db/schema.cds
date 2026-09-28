// namespace myapp;

// entity Album {
//     key ID          : Integer;
//     title           : String(120);
//     description     : String(255);
//     view            : Integer;
//     photos          : Association to many Photo on photos.album = $self;
// }

// entity Location {
//     key ID          : Integer;
//     name            : String(200);
//     shortName       : String(50);
//     photos          : Association to many Photo on photos.location = $self;
// }

// entity Member {
//     key ID          : Integer;
//     name            : String(255);
//     phoneNum        : String(20);
//     email           : String(200);
//     address         : String(255);
//     photos          : Association to many Photo on photos.member = $self;
// }

// entity Photo {
//     key ID          : Integer;
//     album           : Association to Album;
//     location        : Association to Location;
//     member          : Association to Member;
//     title           : String(120);
//     description     : String(255);
//     privacy         : String(20);
//     uploadDate      : Date;
//     view            : Integer;
//     imagePath       : String(50);
//     comments        : Association to many Comment on comments.photo = $self;
//     tagPhotos       : Association to many TagPhoto on tagPhotos.photo = $self;
// }

// entity Comment {
//     key ID          : Integer;
//     photo           : Association to Photo;
//     postDate        : Date;
//     content         : String(255);
// }

// entity Tag {
//     key ID          : Integer;
//     title           : String(120);
// }

// entity TagPhoto {
//     key ID          : Integer;
//     tag             : Association to Tag;
//     photo           : Association to Photo;
// }