//package lk.ijes.backend.repository;
//
//
//import lk.ijes.backend.entity.LoginPage.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.Optional;
//@Repository
//public interface UserRepository extends JpaRepository<User, Long> {
//    Optional<User> findByUsername(String username);
//
//    /*
//    //custom query
//
//    @Query(value = "select * from User where id = ?1",nativeQuery = true)
//    Optional<User> findbyusername(String username);*/
//
//    /*
//    //custom update queery
//
//    @Modifying
//    @Query(value = "select * from User where id = ?1",nativeQuery = true)
//    Optional<User> findbyusername(String username);
//
//    */
//}