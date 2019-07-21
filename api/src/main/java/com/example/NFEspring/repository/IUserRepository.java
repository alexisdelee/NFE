package com.example.NFEspring.repository;

import com.example.NFEspring.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface IUserRepository extends Repository<User, Integer> {

    @Transactional(readOnly = true)
    @Query("select user from User user where user.nfeid = :nfeid and user.deleted = false")
    Collection<User> findByNfeid(@Param("nfeid") String nfeid);

    @Transactional(readOnly = true)
    @Query("select user from User user where user.id = :userId and user.deleted = false")
    Optional<User> findById(@Param("userId") Integer userId);

    @Transactional(readOnly = true)
    @Query("select user from User user where user.pseudo = :pseudo and user.deleted = false")
    Optional<User> findByPseudo(@Param("pseudo") String pseudo);

    @Transactional(readOnly = true)
    @Query("select user from User user where user.deleted = false")
    Collection<User> findAll();

}
